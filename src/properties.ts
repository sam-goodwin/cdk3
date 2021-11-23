// we import these with `import type ..` so that we can @link to them in comments.

// @ts-ignore
import type { TestChain } from "./test-chain";
// @ts-ignore
import type { TestPrivateKeys } from "./test-keys";

/**
 * Names of CloudFormation Properties used to share information from CDK and Lambda.
 */
export function Property<K extends keyof Properties>(key: K): K {
  // simply return the key, the only purpose of this function is to check that the names are correct.
  return key;
}

/**
 * This interface is a type-safe representation of Properties passed to and from CloudFormation Custom Resources.
 */
export interface Properties {
  /**
   * Address of a Wallet or Contract on the Blockchain.
   */
  Address: string;
  /**
   * Globally known ID of a Blockchain.
   */
  ChainID: number;
  /**
   * Friendly name of a Blockchain.
   */
  ChainName: string;
  /**
   * Checksum of a Blockchain Address.
   */
  ChecksumAddress: string;
  /**
   * Name of an S3 Bucket containing a Contract.
   */
  ContractBucketName: string;
  /**
   * Arguments to pass to a Contract's constructor when deploying.
   */
  ContractConstructorArguments: any[] | undefined;
  /**
   * Key of the S3 Object containing a Contract's code.
   */
  ContractObjectKey: string;
  /**
   * Hash of a Blockchain transaction.
   */
  Hash: string;
  /**
   * URL of an Blockchain's RPC endpoint.
   */
  RpcUrl: string;
  /**
   * A Wallet's Public Key.
   */
  PublicKey: string;
  /**
   * Resolved Address of a deployed Contract. This will only differ from {@link Properties.Address} if an ENS name was used in the constructor.
   */
  ResolvedAddress: string;
  /**
   * Index of a test wallet. Useful for transferring funds when using a {@link TestChain}
   *
   * {@link TestPrivateKeys}
   */
  FromWalletId: number;
  /**
   * Address of a Wallet to send funds to.
   */
  ToWalletAddress: string;
  /**
   * Amount to send to a Wallet.
   */
  ToWalletAmount: number;
  /**
   * Friendly name of a Wallet.
   */
  WalletName: string;
  /**
   * ARN of the AWS Secret containing a Wallet's private key.
   */
  WalletSecretArn: string;
}
