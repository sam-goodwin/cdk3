/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/order */
import "jest";
import path from "path";

import { compileContract } from "../src/solc";
import { Property } from "../src/properties";

import { wallets } from "./test-env";

import "./mock-provider";

const mockS3 = {
  getObject: jest.fn(),
};

const mockSecretsManager = {
  getSecretValue: jest.fn(),
};

const mockCallback = {
  callbackToCloudFormation: jest.fn(() => Promise.resolve({})),
};

jest.mock("aws-sdk", () => ({
  S3: class {
    getObject = mockS3.getObject;
  },
  SecretsManager: class {
    getSecretValue = mockSecretsManager.getSecretValue;
  },
}));

jest.mock("../src/cfn-callback", () => mockCallback);
jest.setTimeout(60000);

async function setupMocks() {
  const { handle } = require("../src/contract-deployer");

  const compileRes = compileContract(
    path.join(__dirname, "..", "contracts", "my-erc20.sol")
  );
  const S3Object = {
    Body: compileRes.contracts["my-erc20.sol"].HelloWorld,
  };

  mockS3.getObject.mockReturnValueOnce({
    promise: () => Promise.resolve(S3Object),
  });

  const SecretValue = {
    SecretString: await wallets[0].toV3String("password"),
  };
  mockSecretsManager.getSecretValue.mockReturnValueOnce({
    promise: () => Promise.resolve(SecretValue),
  });

  return { handle, S3: mockS3, SecretsManager: mockSecretsManager };
}

test("CREATE should deploy contract to testnet", async () => {
  const { handle, S3, SecretsManager } = await setupMocks();

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
});
