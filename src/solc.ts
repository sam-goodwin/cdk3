// this file provides a type-safe wrapper around the solidity compiler

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

export interface CompileResponse {}

export interface CompileOptions {
  import(path: string): ImportedSolidityFile;
}

export function compile(
  request: CompileRequest,
  options?: CompileOptions
): CompileResponse {
  return JSON.parse(solc.compile(JSON.stringify(request), options));
}
