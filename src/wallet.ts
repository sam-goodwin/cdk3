import * as kms from "@aws-cdk/aws-kms";
import * as secrets from "@aws-cdk/aws-secretsmanager";
import * as cdk from "@aws-cdk/core";

/**
 * Length of a seed phrase for a new Wallet.
 */
export enum SeedPhraseSize {
  /**
   * 12 word long seed phrase.
   */
  TWELVE = 12,
  /**
   * 24 work long seed phrase.
   */
  TWENTY_FOUR = 24,
}

export interface WalletProps {
  /**
   * Name of the Wallet.
   *
   * @default generated physical name
   */
  readonly walletName?: string;
  /**
   * Number of words to use in the Seed Phrase.
   *
   * @default 24
   */
  readonly seedPhraseSize?: SeedPhraseSize;
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
  }
}
