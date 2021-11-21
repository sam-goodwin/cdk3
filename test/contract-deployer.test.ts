/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/order */
import "jest";
import path from "path";

const ganache = require("ganache-cli");

const testWallet = require("ethereumjs-wallet").default.generate();

import * as eth from "ethers";

const provider = new eth.providers.Web3Provider(ganache.provider());

const S3 = {
  getObject: jest.fn(),
};

const SecretsManager = {
  getSecretValue: jest.fn(),
};

const Wallet = {
  fromV3: jest.fn(),
};

const ethers = {
  providers: {
    getDefaultProvider: jest.fn(() => provider),
    getNetwork: jest.fn(),
  },
  ContractFactory: {
    fromSolidity: jest.fn(),
  },
  Wallet: require("ethers").Wallet,
};

import { compileContract } from "../src/solc";

import { Property } from "../src/properties";

test("CREATE should deploy contract to testnet", async () => {
  jest.mock("ethereumjs-wallet", () => Wallet);
  jest.mock("ethers", () => ethers);
  jest.mock("aws-sdk", () => ({
    S3: class {
      getObject = S3.getObject;
    },
    SecretsManager: class {
      getSecretValue = SecretsManager.getSecretValue;
    },
  }));

  const { handle } = require("../src/contract-deployer");

  const S3Object = {
    Body: JSON.stringify(
      compileContract(path.join(__dirname, "..", "contracts", "my-erc20.sol"))
    ),
  };
  const SecretValue = {
    SecretString: "WalletSecret",
  };

  S3.getObject.mockReturnValueOnce({
    promise: () => Promise.resolve(S3Object),
  });

  SecretsManager.getSecretValue.mockReturnValueOnce({
    promise: () => Promise.resolve(SecretValue),
  });

  Wallet.fromV3.mockReturnValueOnce(testWallet);

  ethers.providers.getDefaultProvider.mockReturnValueOnce(
    require("ganache-cli").provider()
  );
  ethers.providers.getNetwork.mockReturnValueOnce({});

  const ResourceProperties = {
    ServiceToken: "ServiceToken",
    [Property("ContractBucketName")]: "Bucket",
    [Property("ContractObjectKey")]: "ContractObjectKey",
    [Property("WalletSecretArn")]: "WalletSecretArn",
    [Property("RpcUrl")]: "RpcUrl",
  };

  await handle({
    RequestType: "Create",
    RequestId: "RequestId",
    LogicalResourceId: "LogicalResourceId",
    ResourceType: "Custom::Contract",
    ServiceToken: "ServiceToken",
    ResponseURL: "ResponseURL",
    StackId: "StackId",
    ResourceProperties,
  });

  expect(S3.getObject.mock.calls[0]).toEqual([
    {
      Bucket: ResourceProperties.ContractBucketName,
      Key: ResourceProperties.ContractObjectKey,
    },
  ]);
  expect(SecretsManager.getSecretValue.mock.calls[0]).toEqual([
    {
      SecretId: ResourceProperties.WalletSecretArn,
    },
  ]);
  expect(Wallet.fromV3.mock.calls[0]).toEqual([
    SecretValue.SecretString,
    "password",
  ]);
});
