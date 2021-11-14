import "jest";
import * as path from "path";
import * as cdk3 from "../src";
import { stackTest } from "./util";

test(
  "Contract should compile Solidity Contract",
  stackTest((stack) => {
    const owner = new cdk3.Wallet(stack, "Wallet");

    new cdk3.Contract(stack, "Contract", {
      owner,
      contractFile: path.join(__dirname, "..", "contracts", "hello-world.sol"),
    });
  })
);
