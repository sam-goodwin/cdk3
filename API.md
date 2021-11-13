# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Wallet <a name="cdk3.Wallet"></a>

Creates a new Wallet with its Private Key stored in AWS Secrets Manager.

Use this Construct to deploy Smart Contracts via an AWS Code Pipeline.

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

##### `walletResourceHandler`<sup>Required</sup> <a name="cdk3.Wallet.property.walletResourceHandler"></a>

```typescript
public readonly walletResourceHandler: SingletonFunction;
```

- *Type:* [`@aws-cdk/aws-lambda.SingletonFunction`](#@aws-cdk/aws-lambda.SingletonFunction)

Lambda Function which is invoked by CloudFormation during the CRUD lifecycle.

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



