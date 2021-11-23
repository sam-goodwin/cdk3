import "jest";
import "./mock-provider";

import { Property } from "../src/properties";
import { handle } from "../src/test-chain-funding";
import { wallets } from "./test-env";

it("should transfer ETH from fromWallet to the toWallet", async () => {
  const ResourceProperties = {
    ServiceToken: "ServiceToken",
    [Property("ToWalletAddress")]: wallets[0].getAddressString(),
    [Property("FromWalletId")]: 1,
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
});
