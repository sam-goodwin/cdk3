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

new cdk3.Wallet(stack, "Wallet", {});
