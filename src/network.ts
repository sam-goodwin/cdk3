/**
 * Enum of the types of Blockchain platforms
 */
export enum Platform {
  /**
   * Ethereum.
   */
  ETH = "Ethereum",
  BSC = "BinanceSmartChain",
}

/**
 * Network
 */
export class Network {
  constructor(
    readonly platform: Platform,
    readonly name: string,
    readonly chainId: number,
    readonly ensAddress?: string
  ) {}
}

export class Ethereum extends Network {
  static readonly Mainnet = new Ethereum("mainnet", 1);
  static readonly Ropsten = new Ethereum("ropsten", 3);
  static readonly Rinkeby = new Ethereum("rinkeby", 4);
  static readonly Goerli = new Ethereum("goerli", 4);

  constructor(name: string, chainId: number, ensAddress?: string) {
    super(Platform.ETH, name, chainId, ensAddress);
  }
}
