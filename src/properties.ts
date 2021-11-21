/**
 * Names of environment variable keys used to share information from CDK and Lambda.
 */

export function Property<K extends keyof Properties>(key: K): K {
  return key;
}

export interface Properties {
  Address: string;
  ChainID: string;
  ChainName: string;
  ChecksumAddress: string;
  ContractBucketName: string;
  ContractConstructorArguments: string;
  ContractObjectKey: string;
  Hash: string;
  RpcUrl: string;
  PublicKey: string;
  ResolvedAddress: string;
  Transaction: string;
  WalletName: string;
  WalletSecretArn: string;
}
