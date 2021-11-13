import * as path from "path";
import * as fs from "fs";

import * as cdk from "@aws-cdk/core";
import * as kms from "@aws-cdk/aws-kms";
import * as node from "@aws-cdk/aws-lambda-nodejs";
import * as secrets from "@aws-cdk/aws-secretsmanager";

import { EnvironmentKeys } from "./constants";

export interface WalletProps {
  /**
   * Name of the Wallet.
   *
   * @default generated physical name
   */
  readonly walletName?: string;
  /**
   *
   * @default a new KMS encryption key is created for you.
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
  readonly walletResourceHandler: node.NodejsFunction;

  constructor(scope: cdk.Construct, id: string, props: WalletProps = {}) {
    super(scope, id);

    this.encryptionKey =
      props.encryptionKey ??
      new kms.Key(this, "EncryptionKey", {
        enableKeyRotation: true,
      });

    this.privateKey = new secrets.Secret(this, "PrivateKey", {
      encryptionKey: this.encryptionKey,
    });

    // quick check to see if we're running
    const isTsNode = fs
      .statSync(path.join(__dirname, "wallet-keygen.ts"))
      .isFile();

    this.walletResourceHandler = new node.NodejsFunction(
      this,
      "WalletResourceHandler",
      {
        environment: {
          [EnvironmentKeys.WalletSecretArn]: this.privateKey.secretArn,
        },
        entry: path.join(__dirname, `wallet-keygen.${isTsNode ? "ts" : "js"}`),
        handler: "handle",
        memorySize: 512,
        bundling: {
          minify: true,
          sourceMap: true,
          externalModules: ["aws-sdk"],
        },
      }
    );
    // the Lambda only has encrypt access - it cannot decrypt the key.
    this.encryptionKey.grantEncrypt(this.walletResourceHandler);
    // it also cannot read the Wallet Secret.
    this.privateKey.grantWrite(this.walletResourceHandler);
  }
}
