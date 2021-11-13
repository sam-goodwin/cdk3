# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Wallet <a name="cdk3.Wallet"></a>

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

#### Initializers <a name="cdk3.Wallet.Initializer"></a>

```typescript
import { Wallet } from 'cdk3'

new Wallet(scope: Construct, id: string, props?: WalletProps)
```

##### `scope`<sup>Required</sup> <a name="cdk3.Wallet.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk3.Wallet.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk3.Wallet.parameter.props"></a>

- *Type:* [`cdk3.WalletProps`](#cdk3.WalletProps)

---



#### Properties <a name="Properties"></a>

##### `address`<sup>Required</sup> <a name="cdk3.Wallet.property.address"></a>

```typescript
public readonly address: string;
```

- *Type:* `string`

---

##### `checksumAddress`<sup>Required</sup> <a name="cdk3.Wallet.property.checksumAddress"></a>

```typescript
public readonly checksumAddress: string;
```

- *Type:* `string`

---

##### `encryptionKey`<sup>Required</sup> <a name="cdk3.Wallet.property.encryptionKey"></a>

```typescript
public readonly encryptionKey: IKey;
```

- *Type:* [`@aws-cdk/aws-kms.IKey`](#@aws-cdk/aws-kms.IKey)

KMS Encryption Key used to encrypt the Private Key.

---

##### `keyGenerator`<sup>Required</sup> <a name="cdk3.Wallet.property.keyGenerator"></a>

```typescript
public readonly keyGenerator: SingletonFunction;
```

- *Type:* [`@aws-cdk/aws-lambda.SingletonFunction`](#@aws-cdk/aws-lambda.SingletonFunction)

Lambda Function which is invoked by CloudFormation during the CRUD lifecycle.

---

##### `privateKey`<sup>Required</sup> <a name="cdk3.Wallet.property.privateKey"></a>

```typescript
public readonly privateKey: Secret;
```

- *Type:* [`@aws-cdk/aws-secretsmanager.Secret`](#@aws-cdk/aws-secretsmanager.Secret)

AWS Secret securely storing the Private Key.

---

##### `publicKey`<sup>Required</sup> <a name="cdk3.Wallet.property.publicKey"></a>

```typescript
public readonly publicKey: string;
```

- *Type:* `string`

---

##### `walletName`<sup>Required</sup> <a name="cdk3.Wallet.property.walletName"></a>

```typescript
public readonly walletName: string;
```

- *Type:* `string`

---


## Structs <a name="Structs"></a>

### WalletProps <a name="cdk3.WalletProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { WalletProps } from 'cdk3'

const walletProps: WalletProps = { ... }
```

##### `encryptionKey`<sup>Optional</sup> <a name="cdk3.WalletProps.property.encryptionKey"></a>

```typescript
public readonly encryptionKey: IKey;
```

- *Type:* [`@aws-cdk/aws-kms.IKey`](#@aws-cdk/aws-kms.IKey)
- *Default:* a new KMS encryption key is created for you.

---

##### `walletName`<sup>Optional</sup> <a name="cdk3.WalletProps.property.walletName"></a>

```typescript
public readonly walletName: string;
```

- *Type:* `string`
- *Default:* generated physical name

Name of the Wallet.

---



