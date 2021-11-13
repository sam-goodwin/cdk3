import * as path from "path";

import * as kms from "@aws-cdk/aws-kms";
import * as lambda from "@aws-cdk/aws-lambda";
import * as secrets from "@aws-cdk/aws-secretsmanager";
import * as cdk from "@aws-cdk/core";

import { EnvironmentKeys } from "./constants";

export interface WalletProps {
  /**
   * Name of the Wallet.
   *
   * @default - generated physical name
   */
  readonly walletName?: string;
  /**
   *
   * @default - a new KMS encryption key is created for you.
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Creates a new Wallet with its Private Key stored in AWS Secrets Manager.
 *
 * Use this Construct to deploy Smart Contracts via an AWS Code Pipeline.
 */
export class Wallet extends cdk.Construct {
  /**
   * AWS Secret securely storing the Private Key.
   */
  readonly privateKey: secrets.Secret;

  /**
   * KMS Encryption Key used to encrypt the Private Key.
   */
  readonly encryptionKey: kms.IKey;

  /**
   * Lambda Function which is invoked by CloudFormation during the CRUD lifecycle.
   */
  readonly walletResourceHandler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: WalletProps = {}) {
    super(scope, id);

    this.encryptionKey =
      props.encryptionKey ??
      new kms.Key(this, "EncryptionKey", {
        enableKeyRotation: true,
        alias: props.walletName ? `${props.walletName}-key` : undefined,
        description: `Encryption Key securing the ${
          props.walletName ? `'${props.walletName}' Wallet` : "Wallet"
        }.`,
      });

    this.privateKey = new secrets.Secret(this, "PrivateKey", {
      encryptionKey: this.encryptionKey,
    });

    this.walletResourceHandler = new lambda.Function(
      this,
      "WalletResourceHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset(
          path.join(__dirname, "..", "lib", "wallet-keygen")
        ),
        handler: "index.handle",
        memorySize: 512,
        environment: {
          [EnvironmentKeys.WalletSecretArn]: this.privateKey.secretArn,
        },
      }
    );
    // the Lambda only has encrypt access - it cannot decrypt the key.
    this.encryptionKey.grantEncrypt(this.walletResourceHandler);
    // it also cannot read the Wallet Secret.
    this.privateKey.grantWrite(this.walletResourceHandler);
  }
}
