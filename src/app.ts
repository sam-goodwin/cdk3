/* eslint-disable */
import * as path from "path";
import * as cdk from "@aws-cdk/core";
import * as cdk3 from ".";

// application for testing deployments
const app = new cdk.App();

const stack = new cdk.Stack(app, "test-cdk3-10", {
  env: {
    account: process.env.ENV_AWS_ACCOUNT_ID,
    region: process.env.ENV_AWS_REGION ?? "us-west-2",
  },
});

const wallet = new cdk3.Wallet(stack, "Wallet");

const testnet = new cdk3.TestChain(stack, "Testnet");

// console.log([wallet, testnet, path].length);

new cdk3.Contract(stack, "HelloWorld", {
  owner: wallet,
  chain: testnet,
  contractFile: path.join(__dirname, "..", "contracts", "my-erc20.sol"),
  contractName: "HelloWorld",
});
