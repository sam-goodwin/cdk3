import Wallet from "ethereumjs-wallet";
import * as eth from "ethers";
import Ganache from "ganache-core";

import { TestMnemonic, TestPrivateKeys } from "../src";

const gProvider = Ganache.provider({
  mnemonic: TestMnemonic,
}) as any;

export const wallets = TestPrivateKeys.map((key) => {
  try {
    return Wallet.fromPrivateKey(Buffer.from(key, "hex"));
  } catch (err) {
    throw err;
  }
});

export const provider = new eth.providers.Web3Provider(gProvider);
