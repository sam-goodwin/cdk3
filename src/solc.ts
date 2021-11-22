// this file provides a type-safe wrapper around the solidity compiler

import * as fs from "fs";
import * as path from "path";
import * as resolve from "resolve";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const solc = require("solc");

export interface SolidityFile {
  content: string;
}
export interface ImportedSolidityFile {
  contents: string;
}

export interface CompileRequest {
  language: "Solidity";
  sources: {
    [fileName: string]: SolidityFile;
  };
  settings?: {
    outputSelection: {
      [glob: string]: {
        [glob: string]: string[];
      };
    };
  };
}

export interface CompileResponse {
  contracts: {
    [fileName: string]: {
      [contractName: string]: {
        abi: any;
        evm: {
          bytecode: {
            /**
             * Hex string of the compiled contract's byte code.
             */
            object: string;
          };
        };
      };
    };
  };
}

export interface CompileOptions {
  import(path: string): ImportedSolidityFile;
}

/**
 * Type-safe wrapper of the solc-js compile function.
 */
export function compile(
  request: CompileRequest,
  options?: CompileOptions
): CompileResponse {
  return JSON.parse(solc.compile(JSON.stringify(request), options));
}

/**
 * Compiles a Solidity Contract with a node-module resolver for imports.
 */
export function compileContract(contractFile: string): CompileResponse {
  return compile(
    {
      language: "Solidity",
      sources: {
        [path.basename(contractFile)]: {
          content: fs.readFileSync(contractFile).toString("utf8"),
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    },
    {
      import: (importPath: string) => {
        // use node module resolution to find solidity imports
        const foundPath = tryResolvePath(
          importPath,
          path.dirname(contractFile)
        );
        return {
          contents: fs.readFileSync(foundPath).toString("utf8"),
        };
      },
    }
  );
}

function tryResolvePath(importPath: string, basedir: string): string {
  try {
    // attempt to load the importPath as if it were a valid node module path
    // i.e. `require("@open-zeppelin/contracts/tokens/ERC2")`
    return resolve.sync(importPath, {
      basedir,
    });
  } catch (err) {
    // for some reason the solc compiler strips relative paths when it tries to import
    // this hacky heuristic here attempts to resolves a file relative to the contract
    // path in case the node module resolution logic fails
    // e.g. `import "./ERC2.sol"`
    const local = `./${importPath}`;
    return resolve.sync(local, {
      basedir,
    });
  }
}
