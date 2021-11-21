import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import * as cdk from "@aws-cdk/core";

export interface IChain {
  readonly chainName: string;
  readonly chainId: number;
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

export interface LocalEthChainProps {
  /**
   * VPC to run the local network win.
   *
   * @default - a VPC is created for you.
   */
  readonly vpc?: ec2.Vpc;
}

export function isLocalEthChain(chain: IChain): chain is LocalEthChain {
  return (chain as LocalEthChain).kind === "LocalEthChain";
}

/**
 * Creates a local Ethereum chain hosted on an ECS Fargate cluster.
 */
export class LocalEthChain extends cdk.Construct implements IChain {
  readonly kind: "LocalEthChain" = "LocalEthChain";

  readonly chainName: string;
  readonly chainId: number;
  readonly rpcUrl?: string;
  readonly vpc: ec2.Vpc;
  readonly service: ecsPatterns.NetworkLoadBalancedFargateService;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: LocalEthChainProps = {}
  ) {
    super(scope, id);

    this.chainName = "Ethereum";
    this.chainId = 1;
    this.vpc = props.vpc ?? new ec2.Vpc(this, "VPC");

    this.service = new ecsPatterns.NetworkLoadBalancedFargateService(
      this,
      "Service",
      {
        vpc: this.vpc,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("trufflesuite/ganache-cli"),
          containerPort: 8545,
        },
        listenerPort: 8545,
      }
    );

    this.rpcUrl = `https://${this.service.loadBalancer.loadBalancerDnsName}`;
  }
}
