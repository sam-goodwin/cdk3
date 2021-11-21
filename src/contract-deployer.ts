import { CloudFormationCustomResourceEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

import * as Wallet from "ethereumjs-wallet";
import * as ethers from "ethers";
import {
  callbackToCloudFormation,
  getNumberOrUndefined,
  getString,
  getStringOrUndefined,
} from "./cfn-util";
import { Property } from "./properties";

const s3 = new AWS.S3();
const secrets = new AWS.SecretsManager();

/**
 * Entrypoint to the Contract Deployer Lambda Function. This Function is called
 * as part of the CloudFormation CRUD lifecycle for the Custom::Contract Resource.
 */
export async function handle(event: CloudFormationCustomResourceEvent) {
  try {
    const bucketName = getString(event, Property("ContractBucketName"));
    const objectKey = getString(event, Property("ContractObjectKey"));
    const walletSecretArn = getString(event, Property("WalletSecretArn"));
    const rpcURL = getStringOrUndefined(event, Property("RpcUrl"));
    const chainId = getNumberOrUndefined(event, Property("ChainID"));
    const chainName = getStringOrUndefined(event, Property("ChainName"));

    if (
      rpcURL === undefined &&
      (chainId === undefined || chainName === undefined)
    ) {
      throw new Error(
        `you must provide either the '${Property(
          "RpcUrl"
        )}'' or both the '${Property("ChainID")}' and '${Property(
          "ChainName"
        )}' properties.`
      );
    }

    const args =
      event.ResourceProperties[Property("ContractConstructorArguments")];
    if (
      !(Property("ContractConstructorArguments") in event.ResourceProperties)
    ) {
      throw new Error(
        `missing property '${Property("ContractConstructorArguments")}'.`
      );
    } else if (args !== undefined && !Array.isArray(args)) {
      throw new Error(
        `expected array for property '${Property(
          "ContractConstructorArguments"
        )}'.`
      );
    }

    const [contractObject, encryptedWallet] = await Promise.all([
      s3
        .getObject({
          Bucket: bucketName,
          Key: objectKey,
        })
        .promise(),
      secrets
        .getSecretValue({
          SecretId: walletSecretArn,
        })
        .promise(),
    ]);

    if (encryptedWallet.SecretString === undefined) {
      throw new Error(`failed to load wallet from '${walletSecretArn}'.`);
    }
    const decryptedWallet = await Wallet.default.fromV3(
      encryptedWallet.SecretString,
      "password"
    );

    const provider = ethers.providers.getDefaultProvider(
      ethers.providers.getNetwork(
        rpcURL
          ? rpcURL
          : {
              chainId: chainId!,
              name: chainName!,
            }
      )
    );
    const walletSigner = new ethers.Wallet(
      decryptedWallet.getPrivateKeyString(),
      provider
    );

    if (event.RequestType === "Create") {
      // TODO
      const contractFactory = ethers.ContractFactory.fromSolidity(
        contractObject.Body,
        walletSigner
      );

      const contract = await contractFactory.deploy(...args);

      await callbackToCloudFormation(event, {
        Status: "SUCCESS",
        PhysicalResourceId: contract.address,
        Data: {
          [Property("Address")]: contract.address,
          [Property("Hash")]: contract.deployTransaction.hash,
          [Property("ResolvedAddress")]: await contract.resolvedAddress,
        },
      });
    } else {
      await callbackToCloudFormation(event, {
        Status: "SUCCESS",
        PhysicalResourceId: event.PhysicalResourceId,
      });
    }
  } catch (err) {
    await callbackToCloudFormation(event, {
      Status: "FAILED",
      PhysicalResourceId:
        event.RequestType === "Create" ? "" : event.PhysicalResourceId,
      Reason: (err as any).message,
    });
  }
}

// const factory = new ContractFactory(contractAbi, contractByteCode);

// // If your contract requires constructor args, you can specify them here
// const contract = await factory.deploy(deployArgs);

// console.log(contract.address);
// console.log(contract.deployTransaction);
