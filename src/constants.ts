/**
 * Names of environment variable keys used to share information from CDK and Lambda.
 */

export function Property<K extends keyof Properties>(key: K): K {
  return key;
}

export interface Properties {
  Address: string;
  ResolvedAddress: string;
  ChecksumAddress: string;
  ContractBucketName: string;
  ContractObjectKey: string;
  ContractConstructorArguments: string;
  PublicKey: string;
  Transaction: string;
  WalletName: string;
  WalletSecretArn: string;
}
