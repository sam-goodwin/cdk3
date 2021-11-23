import * as fs from "fs";

import * as path from "path";
import * as lambda from "@aws-cdk/aws-lambda";
import { Asset } from "@aws-cdk/aws-s3-assets";
import * as cdk from "@aws-cdk/core";
import { IChain } from "./chain";
import { Property } from "./properties";
import { compileContract } from "./solc";
import { isTestChain } from "./test-chain";
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
   * Name of the Contract to deploy.
   */
  readonly contractName: string;

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

  /**
   * Blockchain to deploy this Contract to.
   */
  readonly chain: IChain;
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

  /**
   * Hash of the deploy transaction.
   */
  readonly hash: string;

  /**
   * Blockchain this Contract is deployed to.
   */
  readonly chain: IChain;

  constructor(scope: cdk.Construct, id: string, props: ContractProps) {
    super(scope, id);

    this.owner = props.owner;
    this.chain = props.chain;

    // compile the contract and write it to cdk3.out/(node address)
    const compiled = compileContract(props.contractFile);
    const compiledContract =
      compiled.contracts[path.basename(props.contractFile)]?.[
        props.contractName
      ];
    if (compiledContract === undefined) {
      throw new Error(
        `could not find contract '${props.contractName}' in file '${props.contractFile}'`
      );
    }
    const assetPath = `${path.join(
      process.cwd(),
      "cdk3.out",
      this.node.addr
    )}.json`;
    fs.mkdirSync(path.join(process.cwd(), "cdk3.out"), { recursive: true });
    fs.writeFileSync(assetPath, JSON.stringify(compiledContract, null, 2));

    this.asset = new Asset(this, "CompiledContract", {
      path: assetPath,
    });

    const deployFunction = new lambda.Function(this, "Deployer", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(
        path.join(__dirname, "..", "lib", "contract-deployer")
      ),
      handler: "index.handle",
      memorySize: 512,
      timeout: cdk.Duration.minutes(1),
      vpc: isTestChain(props.chain) ? props.chain.vpc : undefined,
    });

    this.owner.grantRead(deployFunction);
    this.asset.grantRead(deployFunction);

    const contractResource = new cdk.CustomResource(this, "Contract", {
      serviceToken: deployFunction.functionArn,
      properties: {
        [Property("ChainID")]: props.chain.chainId,
        [Property("ChainName")]: props.chain.chainName,
        [Property("ContractBucketName")]: this.asset.s3BucketName,
        [Property("ContractConstructorArguments")]: props.constructorArguments,
        [Property("ContractObjectKey")]: this.asset.s3ObjectKey,
        [Property("RpcUrl")]: props.chain.rpcUrl,
        [Property("WalletSecretArn")]: this.owner.privateKey.secretArn,
      },
    });

    this.address = contractResource.getAttString(Property("Address"));
    this.hash = contractResource.getAttString(Property("Hash"));
    this.resolvedAddress = contractResource.getAttString(
      Property("ResolvedAddress")
    );
  }
}
