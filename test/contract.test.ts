import "jest";
import * as path from "path";
import * as cdk3 from "../src";
import { stackTest } from "./util";

test(
  "Contract should compile Solidity Contract",
  stackTest((stack) => {
    const owner = new cdk3.Wallet(stack, "Wallet");

    const chain = new cdk3.TestChain(stack, "Chain");

    new cdk3.Contract(stack, "Contract", {
      owner,
      chain,
      contractFile: path.join(__dirname, "..", "contracts", "my-erc20.sol"),
      contractName: "HelloWorld",
    });
  })
);
