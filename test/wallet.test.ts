import "jest";
import * as cdk from "@aws-cdk/core";
import * as cdk3 from "../src";

test("default wallet should provision an AWS Secret and KMS Encryption Key", () => {
  const app = new cdk.App({
    autoSynth: false,
  });
  const stack = new cdk.Stack(app, "Test");

  new cdk3.Wallet(stack, "Wallet");

  expect((stack as any)._toCloudFormation()).toMatchSnapshot();
});
