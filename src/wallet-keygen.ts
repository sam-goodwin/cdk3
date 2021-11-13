import type { CloudFormationCustomResourceEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as Wallet from "ethereumjs-wallet";

import { callbackToCloudFormation, getString } from "./cfn-util";
import { EnvironmentKeys } from "./constants";

const secrets = new AWS.SecretsManager();

/**
 * Entrypoint for a Lambda Function to operate the Wallet Resoruce's
 * CloudFormation Custom Resource workflow.
 *
 * On the Create event, a seed phrase is generated and uploaded to AWS Secrets Manager.
 */
export async function handle(event: CloudFormationCustomResourceEvent) {
  try {
    const secretArn = getString(event, EnvironmentKeys.WalletSecretArn);
    if (event.RequestType === "Create") {
      // generate a new Wallet address
      const wallet = Wallet.default.generate();

      // Store the V3 KeyStore in AWS KMS.
      await secrets
        .updateSecret({
          SecretId: secretArn,
          Description: "Etheruem Wallet Private Key and Seed Phrase",
          SecretString: await wallet.toV3String("password"),
        })
        .promise();

      wallet.getAddress;

      await callbackToCloudFormation(event, {
        Status: "SUCCESS",
        // proxy the Secret's ARN through as the Physical ID of the Wallet.
        PhysicalResourceId: secretArn,
        Data: {
          // export public information as a Resource propert
          PublicKey: wallet.getPublicKeyString(),
          Address: wallet.getAddressString(),
          ChecksumAddress: wallet.getChecksumAddressString(),
        },
      });
    } else {
      // both DELETE and UPDATE are no-ops for now
      await callbackToCloudFormation(event, {
        Status: "SUCCESS",
        PhysicalResourceId: event.PhysicalResourceId,
        Data: event.ResourceProperties,
      });
    }
  } catch (err) {
    await callbackToCloudFormation(event, {
      Status: "FAILED",
      Reason: (err as any).message,
      PhysicalResourceId: "UNKNOWN",
    });
  }
}
