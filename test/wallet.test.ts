import "jest";
import * as cdk3 from "../src";
import { stackTest } from "./util";

test(
  "default wallet should provision an AWS Secret and KMS Encryption Key",
  stackTest((stack) => {
    new cdk3.Wallet(stack, "Wallet");
  })
);
