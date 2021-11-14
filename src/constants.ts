/**
 * Names of environment variable keys used to share information from CDK and Lambda.
 */
export enum EnvironmentKeys {
  Address = "Address",
  ChecksumAddress = "ChecksumAddress",
  ContractBucketName = "ContractBucketName",
  ContractObjectKey = "ContractObjectKey",
  PublicKey = "PublicKey",
  Transaction = "Transaction",
  WalletName = "WalletName",
  WalletSecretArn = "WalletSecretArn",
}
