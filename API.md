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

##### `chain`<sup>Required</sup> <a name="cdk3.Contract.property.chain"></a>

```typescript
public readonly chain: IChain;
```

- *Type:* [`cdk3.IChain`](#cdk3.IChain)

Blockchain this Contract is deployed to.

---

##### `hash`<sup>Required</sup> <a name="cdk3.Contract.property.hash"></a>

```typescript
public readonly hash: string;
```

- *Type:* `string`

Hash of the deploy transaction.

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


### TestChain <a name="cdk3.TestChain"></a>

- *Implements:* [`cdk3.IChain`](#cdk3.IChain)

Creates a local Ethereum chain hosted on an ECS Fargate cluster.

#### Initializers <a name="cdk3.TestChain.Initializer"></a>

```typescript
import { TestChain } from 'cdk3'

new TestChain(scope: Construct, id: string, props?: TestChainProps)
```

##### `scope`<sup>Required</sup> <a name="cdk3.TestChain.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk3.TestChain.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="cdk3.TestChain.parameter.props"></a>

- *Type:* [`cdk3.TestChainProps`](#cdk3.TestChainProps)

---



#### Properties <a name="Properties"></a>

##### `chainId`<sup>Required</sup> <a name="cdk3.TestChain.property.chainId"></a>

```typescript
public readonly chainId: number;
```

- *Type:* `number`

Numerical ID of the TestChain - currently hard-coded as `1`.

---

##### `chainName`<sup>Required</sup> <a name="cdk3.TestChain.property.chainName"></a>

```typescript
public readonly chainName: string;
```

- *Type:* `string`

Name of the TestChain - currently hard-coded as `"Ethereum"`.

---

##### `cluster`<sup>Required</sup> <a name="cdk3.TestChain.property.cluster"></a>

```typescript
public readonly cluster: Cluster;
```

- *Type:* [`@aws-cdk/aws-ecs.Cluster`](#@aws-cdk/aws-ecs.Cluster)

ECS Cluster hosting the TestChain's containers.

---

##### `kind`<sup>Required</sup> <a name="cdk3.TestChain.property.kind"></a>

```typescript
public readonly kind: string;
```

- *Type:* `string`

Type discriminant for distinguishing the TestChain from a live chain.

---

##### `loadBalancer`<sup>Required</sup> <a name="cdk3.TestChain.property.loadBalancer"></a>

```typescript
public readonly loadBalancer: NetworkLoadBalancer;
```

- *Type:* [`@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer`](#@aws-cdk/aws-elasticloadbalancingv2.NetworkLoadBalancer)

Load Balancer for connecting with the TestChain node.

---

##### `service`<sup>Required</sup> <a name="cdk3.TestChain.property.service"></a>

```typescript
public readonly service: FargateService;
```

- *Type:* [`@aws-cdk/aws-ecs.FargateService`](#@aws-cdk/aws-ecs.FargateService)

FargateService running the TestChain nodes.

---

##### `task`<sup>Required</sup> <a name="cdk3.TestChain.property.task"></a>

```typescript
public readonly task: TaskDefinition;
```

- *Type:* [`@aws-cdk/aws-ecs.TaskDefinition`](#@aws-cdk/aws-ecs.TaskDefinition)

ECS Task Definition for the TestChain node.

This task runs the `ganache-cli` underneath.

---

##### `vpc`<sup>Required</sup> <a name="cdk3.TestChain.property.vpc"></a>

```typescript
public readonly vpc: Vpc;
```

- *Type:* [`@aws-cdk/aws-ec2.Vpc`](#@aws-cdk/aws-ec2.Vpc)

VPC containing the service's ECS Cluster.

---

##### `rpcUrl`<sup>Optional</sup> <a name="cdk3.TestChain.property.rpcUrl"></a>

```typescript
public readonly rpcUrl: string;
```

- *Type:* `string`

HTTPS URL for connecting to the TestChain.

It is derived from the Network Load Balancer.

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

##### `chain`<sup>Required</sup> <a name="cdk3.ContractProps.property.chain"></a>

```typescript
public readonly chain: IChain;
```

- *Type:* [`cdk3.IChain`](#cdk3.IChain)

Blockchain to deploy this Contract to.

---

##### `contractFile`<sup>Required</sup> <a name="cdk3.ContractProps.property.contractFile"></a>

```typescript
public readonly contractFile: string;
```

- *Type:* `string`

Name of the Contract `.sol` file to compile.

---

##### `contractName`<sup>Required</sup> <a name="cdk3.ContractProps.property.contractName"></a>

```typescript
public readonly contractName: string;
```

- *Type:* `string`

Name of the Contract to deploy.

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

### TestChainFund <a name="cdk3.TestChainFund"></a>

Struct for configuring a transfer of test funds to a Wallet.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { TestChainFund } from 'cdk3'

const testChainFund: TestChainFund = { ... }
```

##### `amount`<sup>Required</sup> <a name="cdk3.TestChainFund.property.amount"></a>

```typescript
public readonly amount: number;
```

- *Type:* `number`

Amount of ETH to transfer to the Wallet.

---

##### `from`<sup>Required</sup> <a name="cdk3.TestChainFund.property.from"></a>

```typescript
public readonly from: number | string;
```

- *Type:* `number` | `string`

Which test wallet to transfer funds from.

---

##### `to`<sup>Required</sup> <a name="cdk3.TestChainFund.property.to"></a>

```typescript
public readonly to: Wallet;
```

- *Type:* [`cdk3.Wallet`](#cdk3.Wallet)

Wallet to transfer funds to.

---

### TestChainProps <a name="cdk3.TestChainProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { TestChainProps } from 'cdk3'

const testChainProps: TestChainProps = { ... }
```

##### `fund`<sup>Optional</sup> <a name="cdk3.TestChainProps.property.fund"></a>

```typescript
public readonly fund: TestChainFund;
```

- *Type:* [`cdk3.TestChainFund`](#cdk3.TestChainFund)

Configure a transfer of funds from a test wallet to a Wallet Construct.

---

##### `vpc`<sup>Optional</sup> <a name="cdk3.TestChainProps.property.vpc"></a>

```typescript
public readonly vpc: Vpc;
```

- *Type:* [`@aws-cdk/aws-ec2.Vpc`](#@aws-cdk/aws-ec2.Vpc)
- *Default:* a VPC is created for you.

VPC to run the local network win.

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

## Classes <a name="Classes"></a>

### Chain <a name="cdk3.Chain"></a>

- *Implements:* [`cdk3.IChain`](#cdk3.IChain)

#### Initializers <a name="cdk3.Chain.Initializer"></a>

```typescript
import { Chain } from 'cdk3'

new Chain(chainName: string, chainId: number, symbol: string, rpcUrl?: string, blockExplorer?: string)
```

##### `chainName`<sup>Required</sup> <a name="cdk3.Chain.parameter.chainName"></a>

- *Type:* `string`

---

##### `chainId`<sup>Required</sup> <a name="cdk3.Chain.parameter.chainId"></a>

- *Type:* `number`

---

##### `symbol`<sup>Required</sup> <a name="cdk3.Chain.parameter.symbol"></a>

- *Type:* `string`

---

##### `rpcUrl`<sup>Optional</sup> <a name="cdk3.Chain.parameter.rpcUrl"></a>

- *Type:* `string`

---

##### `blockExplorer`<sup>Optional</sup> <a name="cdk3.Chain.parameter.blockExplorer"></a>

- *Type:* `string`

---



#### Properties <a name="Properties"></a>

##### `chainId`<sup>Required</sup> <a name="cdk3.Chain.property.chainId"></a>

```typescript
public readonly chainId: number;
```

- *Type:* `number`

---

##### `chainName`<sup>Required</sup> <a name="cdk3.Chain.property.chainName"></a>

```typescript
public readonly chainName: string;
```

- *Type:* `string`

---

##### `symbol`<sup>Required</sup> <a name="cdk3.Chain.property.symbol"></a>

```typescript
public readonly symbol: string;
```

- *Type:* `string`

---

##### `blockExplorer`<sup>Optional</sup> <a name="cdk3.Chain.property.blockExplorer"></a>

```typescript
public readonly blockExplorer: string;
```

- *Type:* `string`

---

##### `rpcUrl`<sup>Optional</sup> <a name="cdk3.Chain.property.rpcUrl"></a>

```typescript
public readonly rpcUrl: string;
```

- *Type:* `string`

---

#### Constants <a name="Constants"></a>

##### `Avalance` <a name="cdk3.Chain.property.Avalance"></a>

- *Type:* [`cdk3.Chain`](#cdk3.Chain)

> https://www.avax.network/

---

##### `BinanceSmartChain` <a name="cdk3.Chain.property.BinanceSmartChain"></a>

- *Type:* [`cdk3.Chain`](#cdk3.Chain)

> https://www.binance.org/en/smartChain

---

##### `Ethereum` <a name="cdk3.Chain.property.Ethereum"></a>

- *Type:* [`cdk3.Chain`](#cdk3.Chain)

> https://ethereum.org/

---

##### `Fantom` <a name="cdk3.Chain.property.Fantom"></a>

- *Type:* [`cdk3.Chain`](#cdk3.Chain)

> https://fantom.foundation/

---

## Protocols <a name="Protocols"></a>

### IChain <a name="cdk3.IChain"></a>

- *Implemented By:* [`cdk3.Chain`](#cdk3.Chain), [`cdk3.TestChain`](#cdk3.TestChain), [`cdk3.IChain`](#cdk3.IChain)

A Blockchain connection.


#### Properties <a name="Properties"></a>

##### `chainId`<sup>Required</sup> <a name="cdk3.IChain.property.chainId"></a>

```typescript
public readonly chainId: number;
```

- *Type:* `number`

Numerical ID of the Blockchain.

---

##### `chainName`<sup>Required</sup> <a name="cdk3.IChain.property.chainName"></a>

```typescript
public readonly chainName: string;
```

- *Type:* `string`

Name of the Blockchain.

---

##### `rpcUrl`<sup>Optional</sup> <a name="cdk3.IChain.property.rpcUrl"></a>

```typescript
public readonly rpcUrl: string;
```

- *Type:* `string`

RPC URL for interacting with this Blockchain.

---

