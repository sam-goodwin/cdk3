import { CloudFormationCustomResourceEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

import Wallet from "ethereumjs-wallet";
import * as ethers from "ethers";
import { callbackToCloudFormation } from "./cfn-callback";
import {
  getNumberOrUndefined,
  getString,
  getStringOrUndefined,
} from "./cfn-properties";
import { logPromise } from "./log-util";
import { Property } from "./properties";
import { getProvider } from "./provider";

const s3 = new AWS.S3();
const secrets = new AWS.SecretsManager();

/**
 * Entrypoint to the Contract Deployer Lambda Function. This Function is called
 * as part of the CloudFormation CRUD lifecycle for the Custom::Contract Resource.
 */
export async function handle(event: CloudFormationCustomResourceEvent) {
  try {
    console.log(event);
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
    if (args !== undefined && !Array.isArray(args)) {
      throw new Error(
        `expected array for property '${Property(
          "ContractConstructorArguments"
        )}'.`
      );
    }

    const [contractObject, encryptedWallet] = await Promise.all([
      logPromise(
        `download 's3://${bucketName}/${objectKey}'`,
        s3
          .getObject({
            Bucket: bucketName,
            Key: objectKey,
          })
          .promise()
      ),
      logPromise(
        `get secret value: '${walletSecretArn}'`,
        secrets
          .getSecretValue({
            SecretId: walletSecretArn,
          })
          .promise()
      ),
    ]);

    if (encryptedWallet.SecretString === undefined) {
      throw new Error(`failed to load wallet from '${walletSecretArn}'.`);
    }
    const decryptedWallet = await logPromise(
      "decrypt wallet",
      Wallet.fromV3(encryptedWallet.SecretString, "password")
    );

    const provider = getProvider(rpcURL);
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

      const contract = await contractFactory.deploy(...(args ?? []));

      await logPromise(
        "report Create SUCCESS",
        callbackToCloudFormation(event, {
          Status: "SUCCESS",
          PhysicalResourceId: contract.address,
          Data: {
            [Property("Address")]: contract.address,
            [Property("Hash")]: contract.deployTransaction.hash,
            [Property("ResolvedAddress")]: await contract.resolvedAddress,
          },
        })
      );
    } else {
      await logPromise(
        `report ${event.RequestType} SUCCESS`,
        callbackToCloudFormation(event, {
          Status: "SUCCESS",
          PhysicalResourceId: event.PhysicalResourceId,
        })
      );
    }
  } catch (err) {
    console.error(err);
    await logPromise(
      `report ${event.RequestType} FAILED`,
      callbackToCloudFormation(event, {
        Status: "FAILED",
        PhysicalResourceId:
          event.RequestType === "Create"
            ? "failed_contract" // stub physical id for a failed contract creation
            : event.PhysicalResourceId,
        Reason: (err as any).message,
      })
    );
  }
}
