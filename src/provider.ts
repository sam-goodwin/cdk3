import * as ethers from "ethers";

export function getProvider(rpcURL: string) {
  return ethers.providers.getDefaultProvider(
    ethers.providers.getNetwork(rpcURL)
  );
}
