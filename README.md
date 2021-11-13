# cdk3

Construct library for the continuous delivery of web3 dapps in AWS. Includes Constructs for CI/CD pipeline, secure storage of a Wallet's private keys, and web hosting on CloudFront for a cryptocurrency's brand.

### Wallet

The `Wallet` Construct generates an Ethereum compatible wallet and stores it as an encrypted keystore in an AWS Secret encrypted with an AWS KMS Key.

To create a new wallet:

```ts
const wallet = new cdk3.Wallet(this, "Wallet");
```

To access the public key and address Resource Properties:

```ts
wallet.publicKey;
wallet.address;
```

By default, the KMS Key and AWS Secret Resources have generated names. To help with organization, you can set the `walletName` so that those Resources are named according to the convention, `${walletName}-<prefix>`. For example: `my-wallet-key` and `my-wallet-secret`.

```ts
new cdk3.Wallet(this, "Wallet", {
  walletName: "my-wallet",
});
```

To use an existing KMS Key to encrypt the AWS Secret (instead of generating a new one), set the `encryptionKey` property.

```ts
new cdk3.Wallet(this, "Wallet", {
  encryptionKey: myKey,
});
```

### Contract

Coming Soon: https://github.com/punchcard/cdk3/issues/3

### Web Hosting

Coming Soon: https://github.com/punchcard/cdk3/issues/5

### Decentralized Autonomous Organization (DAO)

Coming Soon: https://github.com/punchcard/cdk3/issues/4
