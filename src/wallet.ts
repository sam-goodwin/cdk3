import * as path from "path";

import * as iam from "@aws-cdk/aws-iam";
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
 * The `Wallet` Construct generates an Ethereum compatible wallet and stores it as an encrypted keystore in an AWS Secret encrypted with an AWS KMS Key.
 *
 * To create a new wallet:
 *
 * ```ts
 * const wallet = new cdk3.Wallet(this, "Wallet");
 * ```
 *
 * To access the public key and address Resource Properties:
 *
 * ```ts
 * wallet.publicKey;
 * wallet.address;
 * ```
 *
 * By default, the KMS Key and AWS Secret Resources have generated names. To help with organization, you can set the `walletName` so that those Resources are named according to the convention, `${walletName}-<prefix>`. For example: `my-wallet-key` and `my-wallet-secret`.
 *
 * ```ts
 * new cdk3.Wallet(this, "Wallet", {
 *   walletName: "my-wallet",
 * });
 * ```
 *
 * To use an existing KMS Key to encrypt the AWS Secret (instead of generating a new one), set the `encryptionKey` property.
 *
 * ```ts
 * new cdk3.Wallet(this, "Wallet", {
 *   encryptionKey: myKey,
 * });
 * ```
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
  readonly keyGenerator: lambda.SingletonFunction;

  readonly publicKey: string;
  readonly address: string;
  readonly checksumAddress: string;
  readonly walletName: string;

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
      secretName: props.walletName ? `${props.walletName}-secret` : undefined,
    });

    this.keyGenerator = new lambda.SingletonFunction(this, "KeyGenereator", {
      uuid: "ethereum-wallet-keygenerator",
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(
        path.join(__dirname, "..", "lib", "wallet-keygen")
      ),
      handler: "index.handle",
      memorySize: 512,
      timeout: cdk.Duration.minutes(1),
    });
    // the Lambda only has encrypt access - it cannot decrypt the key.
    this.encryptionKey.grantEncrypt(this.keyGenerator);
    // it also cannot read the Wallet Secret.
    this.privateKey.grantWrite(this.keyGenerator);

    const resource = new cdk.CustomResource(this, "Wallet", {
      resourceType: "Custom::Wallet",
      serviceToken: this.keyGenerator.functionArn,
      properties: {
        [EnvironmentKeys.WalletName]: props.walletName,
        [EnvironmentKeys.WalletSecretArn]: this.privateKey.secretArn,
      },
    });
    this.walletName = resource.getAttString(EnvironmentKeys.WalletName);
    this.publicKey = resource.getAttString(EnvironmentKeys.PublicKey);
    this.address = resource.getAttString(EnvironmentKeys.Address);
    this.checksumAddress = resource.getAttString(
      EnvironmentKeys.ChecksumAddress
    );
  }

  /**
   * Grants read access to this Wallet's private key.
   *
   * The principal will be authorized to read the secret and decrypt with the KMS key.
   *
   * @param grantable principal to authorize access to this Wallet.
   */
  public grantRead(grantable: iam.IGrantable) {
    this.encryptionKey.grantDecrypt(grantable);
    this.privateKey.grantRead(grantable);
  }
}
