# cdk3

Construct library for the continuous delivery of web3 dapps in AWS. Includes Constructs for CI/CD pipeline, secure storage of a Wallet's private keys, and web hosting on CloudFront for a cryptocurrency's brand.


###

```ts
import path from "path";
import * as cdk from "@aws-cdk/core";
import * as cdk3 from "cdk3";
import * as pipeline from "@aws-cdk/pipelines";

export class MyCoinStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // creates a wallet with a private key stored in AWS Secrets Manager Secret.
    this.wallet = new cdk3.Wallet(this, "Wallet", {
      seedPhraseSize: 12 // or 24 
    });

    // build and deploy a Contract to the Binance Smart Chain (BSC).
    // this will compile the contract with `solc` and deploy to the Binance Smart Chain
    this.contract = new cdk3.SolidityContract(this, "BSCContract", {
      code: path.join(__dirname, "..", "contracts"),
      contract: "MyContractName",
    });

    this.pipeline = new pipeline.Pipeline(this, "Pipeline", {
       
    });

    this.pipeline.addStage(new cdk.ContractDeployment(this, "BSCDeploy", {
      chain: cdk3.Chain.BinanceSmartChain,
      contract: this.contract,
    }))
  }
}

export class MyDapp extends pipeline.Stage {
  constructor(scope: Construct, id: string, props?: pipeline.StageProps) {
    super(scope, id, props);

    
  }
}


```