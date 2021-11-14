# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Contract <a name="cdk3.Contract"></a>

Compiles a Solidity Contract with the `solc` compiler and deploys it to a Blockchain network.

#### Initializers <a name="cdk3.Contract.Initializer"></a>

```typescript
import { Contract } from 'cdk3'

new Contract(scope: Construct, id: string, props: ContractProps)
```

##### `scope`<sup>Required</sup> <a name="cdk3.Contract.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk3.Contract.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk3.Contract.parameter.props"></a>

- *Type:* [`cdk3.ContractProps`](#cdk3.ContractProps)

---



#### Properties <a name="Properties"></a>

##### `address`<sup>Required</sup> <a name="cdk3.Contract.property.address"></a>

```typescript
public readonly address: string;
```

- *Type:* `string`

Address of the Contract on the blockchain.

---

##### `asset`<sup>Required</sup> <a name="cdk3.Contract.property.asset"></a>

```typescript
public readonly asset: Asset;
```

- *Type:* [`@aws-cdk/aws-s3-assets.Asset`](#@aws-cdk/aws-s3-assets.Asset)

Asset containing the compiled Solidity Contract.

---

##### `deployTransaction`<sup>Required</sup> <a name="cdk3.Contract.property.deployTransaction"></a>

```typescript
public readonly deployTransaction: string;
```

- *Type:* `string`

---

##### `owner`<sup>Required</sup> <a name="cdk3.Contract.property.owner"></a>

```typescript
public readonly owner: Wallet;
```

- *Type:* [`cdk3.Wallet`](#cdk3.Wallet)

Wallet which owns this Contract.

---

##### `resolvedAddress`<sup>Required</sup> <a name="cdk3.Contract.property.resolvedAddress"></a>

```typescript
public readonly resolvedAddress: string;
```

- *Type:* `string`

This will always be an address.

This will only differ from address if an ENS name was used in the constructor

---


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

#### Methods <a name="Methods"></a>

##### `grantRead` <a name="cdk3.Wallet.grantRead"></a>

```typescript
public grantRead(grantable: IGrantable)
```

###### `grantable`<sup>Required</sup> <a name="cdk3.Wallet.parameter.grantable"></a>

- *Type:* [`@aws-cdk/aws-iam.IGrantable`](#@aws-cdk/aws-iam.IGrantable)

principal to authorize access to this Wallet.

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

### ContractProps <a name="cdk3.ContractProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { ContractProps } from 'cdk3'

const contractProps: ContractProps = { ... }
```

##### `contractFile`<sup>Required</sup> <a name="cdk3.ContractProps.property.contractFile"></a>

```typescript
public readonly contractFile: string;
```

- *Type:* `string`

Name of the Contract `.sol` file to compile.

---

##### `owner`<sup>Required</sup> <a name="cdk3.ContractProps.property.owner"></a>

```typescript
public readonly owner: Wallet;
```

- *Type:* [`cdk3.Wallet`](#cdk3.Wallet)

Wallet which owns this Contract.

---

##### `basePath`<sup>Optional</sup> <a name="cdk3.ContractProps.property.basePath"></a>

```typescript
public readonly basePath: string;
```

- *Type:* `string`
- *Default:* current working directory.

Specify the `basePath` for the `solc` compiler.

The `contractFile` path is relative to this pathh.

> https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html#base-path-and-import-remapping

---

##### `constructorArguments`<sup>Optional</sup> <a name="cdk3.ContractProps.property.constructorArguments"></a>

```typescript
public readonly constructorArguments: any[];
```

- *Type:* `any`[]

Argument values to pass to the Contract's constructor.

---

##### `includePaths`<sup>Optional</sup> <a name="cdk3.ContractProps.property.includePaths"></a>

```typescript
public readonly includePaths: string[];
```

- *Type:* `string`[]
- *Default:* current working directory.

Specify paths containing external code required by the compiler.

> https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html#base-path-and-import-remapping

---

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



