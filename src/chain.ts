import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import * as cdk from "@aws-cdk/core";
import { TestMnemonic } from ".";

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

export function isTestChain(chain: IChain): chain is TestChain {
  return (chain as TestChain).kind === "TestChain";
}

/**
 * Creates a local Ethereum chain hosted on an ECS Fargate cluster.
 */
export class TestChain extends cdk.Construct implements IChain {
  readonly kind: "TestChain" = "TestChain";

  readonly chainName: string;
  readonly chainId: number;
  readonly rpcUrl?: string;

  readonly vpc: ec2.Vpc;
  readonly service: ecs.FargateService;
  readonly cluster: ecs.Cluster;
  readonly task: ecs.TaskDefinition;
  readonly loadBalancer: elb.NetworkLoadBalancer;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: LocalEthChainProps = {}
  ) {
    super(scope, id);

    this.chainName = "Ethereum";
    this.chainId = 1;
    this.vpc = props.vpc ?? new ec2.Vpc(this, "VPC");

    this.cluster = new ecs.Cluster(this, "Cluster", {
      vpc: this.vpc,
    });
    this.task = new ecs.TaskDefinition(this, "Node", {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: "256",
      memoryMiB: "512",
    });
    this.task.addContainer("Ganache", {
      image: ecs.ContainerImage.fromRegistry("trufflesuite/ganache-cli"),
      command: ["-m", `"${TestMnemonic}"`],
      portMappings: [
        {
          containerPort: 8545,
          hostPort: 8545,
        },
      ],
    });
    this.service = new ecs.FargateService(this, "Service", {
      cluster: this.cluster,
      taskDefinition: this.task,
    });

    this.loadBalancer = new elb.NetworkLoadBalancer(this, "LoadBalancer", {
      vpc: this.vpc,
      internetFacing: false,
    });
    const listener = this.loadBalancer.addListener("NodeListener", {
      port: 8545,
    });
    listener.addTargets("ECS", {
      port: 8545,
      targets: [this.service],
    });

    this.rpcUrl = `https://${this.loadBalancer.loadBalancerDnsName}`;
  }
}
