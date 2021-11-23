/**
 * A Blockchain connection.
 */
export interface IChain {
  /**
   * Name of the Blockchain.
   */
  readonly chainName: string;
  /**
   * Numerical ID of the Blockchain.
   */
  readonly chainId: number;
  /**
   * RPC URL for interacting with this Blockchain.
   */
  readonly rpcUrl?: string;
}

export class Chain implements IChain {
  /**
   * @see https://ethereum.org/
   */
  public static readonly Ethereum = new Chain("Ethereum", 1, "ETH");

  /**
   * @see https://www.binance.org/en/smartChain
   */
  public static readonly BinanceSmartChain = new Chain(
    "Binance Smart Chain",
    56,
    "BNB",
    "https://bsc-dataseed.binance.org/",
    "https://bscscan.com"
  );

  /**
   * @see https://www.avax.network/
   */
  public static readonly Avalance = new Chain(
    "Avalanche",
    43114,
    "AVAX",
    "https://api.avax.network/ext/bc/C/rpc",
    "https://snowtrace.io/"
  );

  /**
   * @see https://fantom.foundation/
   */
  public static readonly Fantom = new Chain(
    "Fantom",
    250,
    "FTM",
    "https://rpc.ftm.tools/",
    "https://ftmscan.com/"
  );

  constructor(
    readonly chainName: string,
    readonly chainId: number,
    readonly symbol: string,
    readonly rpcUrl?: string,
    readonly blockExplorer?: string
  ) {}
}
