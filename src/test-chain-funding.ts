import { CloudFormationCustomResourceEvent } from "aws-lambda";
import * as ethers from "ethers";
import { callbackToCloudFormation } from "./cfn-callback";
import { getNumber, getString } from "./cfn-properties";
import { logPromise } from "./log-util";
import { Property } from "./properties";
import { getProvider } from "./provider";
import { TestPrivateKeys } from "./test-keys";
/**
 * Lambda Function endpoint for transferring funds from a test wallet to a Wallet construct.
 */
export async function handle(event: CloudFormationCustomResourceEvent) {
  console.log(event);
  if (event.RequestType === "Create") {
    const toWalletAddress = getString(event, Property("ToWalletAddress"));
    const toWalletAmount = getNumber(event, Property("ToWalletAmount"));
    const testWalletId = getNumber(event, Property("FromWalletId"));
    const rpcUrl = getString(event, Property("RpcUrl"));
    if (testWalletId < 0 || testWalletId >= TestPrivateKeys.length) {
      throw new Error(
        `The property, '${Property("FromWalletId")}', must be between 0 and ${
          TestPrivateKeys.length
        }`
      );
    }

    const fromWallet = new ethers.Wallet(
      TestPrivateKeys[testWalletId],
      getProvider(rpcUrl)
    );

    const toWallet = new ethers.Wallet(toWalletAddress);

    const [from, to] = await Promise.all([
      logPromise("get fromWallet address", fromWallet.getAddress()),
      logPromise("get toWallet address", toWallet.getAddress()),
    ]);
    await logPromise(
      "send transaction",
      fromWallet.sendTransaction({
        from,
        to,
        value: toWalletAmount,
        nonce: new Date().getTime(),
        gasLimit: 1,
        gasPrice: 0.1,
      })
    );
  } else {
    await logPromise(
      `report ${event.ResourceType} SUCCESS`,
      callbackToCloudFormation(event, {
        Status: "SUCCESS",
        PhysicalResourceId: event.PhysicalResourceId,
      })
    );
  }
}
