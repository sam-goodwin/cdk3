import * as cdk from "@aws-cdk/core";
import * as cdk3 from ".";

const app = new cdk.App();
const stack = new cdk.Stack(app, "test-cdk3", {
  env: {
    account: "720731445728",
    region: "us-west-2",
  },
});

new cdk3.Wallet(stack, "Wallet");
