import * as fs from "fs";

import * as path from "path";
import * as lambda from "@aws-cdk/aws-lambda";
import { Asset } from "@aws-cdk/aws-s3-assets";
import * as cdk from "@aws-cdk/core";
import * as resolve from "resolve";

import { Property } from "./constants";
import * as solc from "./solc";
import { Wallet } from "./wallet";

export interface ContractProps {
  /**
   * Wallet which owns this Contract.
   */
  readonly owner: Wallet;

  /**
   * Name of the Contract `.sol` file to compile.
   */
  readonly contractFile: string;

  /**
   * Argument values to pass to the Contract's constructor.
   */
  readonly constructorArguments?: any[];

  /**
   * Specify the `basePath` for the `solc` compiler. The `contractFile` path is relative to this pathh.
   *
   * @default current working directory.
   * @see https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html#base-path-and-import-remapping
   */
  readonly basePath?: string;

  /**
   * Specify paths containing external code required by the compiler.
   *
   * @default current working directory.
   * @see https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html#base-path-and-import-remapping
   */
  readonly includePaths?: string[];
}

/**
 * Compiles a Solidity Contract with the `solc` compiler and deploys it to a Blockchain network.
 */
export class Contract extends cdk.Construct {
  /**
   * Wallet which owns this Contract.
   */
  readonly owner: Wallet;

  /**
   * Asset containing the compiled Solidity Contract.
   */
  readonly asset: Asset;

  /**
   * Address of the Contract on the blockchain.
   */
  readonly address: string;

  /**
   * This will always be an address. This will only differ from address if an ENS name was used in the constructor
   */
  readonly resolvedAddress: string;

  constructor(scope: cdk.Construct, id: string, props: ContractProps) {
    super(scope, id);

    this.owner = props.owner;

    this.asset = new Asset(this, "CompiledContract", {
      path: this.compileContract(props),
    });

    const deployFunction = new lambda.Function(this, "KeyGenereator", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(
        path.join(__dirname, "..", "lib", "contract-deployer")
      ),
      handler: "index.handle",
      memorySize: 512,
      timeout: cdk.Duration.minutes(1),
    });

    this.owner.grantRead(deployFunction);

    const contractResource = new cdk.CustomResource(this, "Contract", {
      serviceToken: deployFunction.functionArn,
      properties: {
        [Property("WalletSecretArn")]: this.owner.privateKey.secretArn,
        [Property("ContractBucketName")]: this.asset.s3BucketName,
        [Property("ContractObjectKey")]: this.asset.s3ObjectKey,
        [Property("ContractConstructorArguments")]: props.constructorArguments,
      },
    });

    this.address = contractResource.getAttString(Property("Address"));
    this.resolvedAddress = contractResource.getAttString(
      Property("ResolvedAddress")
    );
    this.deployTransaction = contractResource.getAttString(
      Property("Transaction")
    );
  }

  /**
   * Compiles a Solidity Contract and returns the path to the compiled Contract file.
   * @returns path to the compiled contract data.
   */
  private compileContract(props: ContractProps) {
    const compiled = solc.compile(
      {
        language: "Solidity",
        sources: {
          [path.basename(props.contractFile)]: {
            content: fs.readFileSync(props.contractFile).toString("utf8"),
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
            path.dirname(props.contractFile)
          );
          return {
            contents: fs.readFileSync(foundPath).toString("utf8"),
          };
        },
      }
    );

    fs.mkdirSync(path.join(process.cwd(), "cdk3.out"), { recursive: true });
    const assetPath = `${path.join(
      process.cwd(),
      "cdk3.out",
      this.node.addr
    )}.json`;
    fs.writeFileSync(assetPath, JSON.stringify(compiled, null, 2));
    return assetPath;
  }
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
