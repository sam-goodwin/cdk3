import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as elb from "@aws-cdk/aws-elasticloadbalancingv2";
import * as cdk from "@aws-cdk/core";
import { IChain } from "./chain";
import { TestMnemonic, TestPrivateKeys } from "./test-keys";
import { Wallet } from "./wallet";

export interface TestChainProps {
  /**
   * VPC to run the local network win.
   *
   * @default - a VPC is created for you.
   */
  readonly vpc?: ec2.Vpc;

  /**
   * Configure a transfer of funds from a test wallet to a Wallet Construct.
   */
  readonly fund?: TestChainFund;
}

/**
 * Struct for configuring a transfer of test funds to a Wallet.
 */
export interface TestChainFund {
  /**
   * Which test wallet to transfer funds from.
   */
  readonly from: keyof typeof TestPrivateKeys;
  /**
   * Wallet to transfer funds to.
   */
  readonly to: Wallet;
  /**
   * Amount of ETH to transfer to the Wallet.
   */
  readonly amount: number;
}

/**
 * Checks if a Chain is the TestChain.
 */
export function isTestChain(chain: IChain): chain is TestChain {
  return (chain as TestChain).kind === "TestChain";
}

/**
 * Creates a local Ethereum chain hosted on an ECS Fargate cluster.
 */
export class TestChain extends cdk.Construct implements IChain {
  /**
   * Type discriminant for distinguishing the TestChain from a live chain.
   */
  readonly kind: "TestChain" = "TestChain";
  /**
   * Name of the TestChain - currently hard-coded as `"Ethereum"`.
   */
  readonly chainName: string;
  /**
   * Numerical ID of the TestChain - currently hard-coded as `1`.
   */
  readonly chainId: number;
  /**
   * HTTPS URL for connecting to the TestChain. It is derived from the Network Load Balancer.
   */
  readonly rpcUrl?: string;
  /**
   * VPC containing the service's ECS Cluster.
   */
  readonly vpc: ec2.Vpc;
  /**
   * ECS Cluster hosting the TestChain's containers.
   */
  readonly cluster: ecs.Cluster;
  /**
   * FargateService running the TestChain nodes.
   */
  readonly service: ecs.FargateService;
  /**
   * ECS Task Definition for the TestChain node. This task runs the `ganache-cli` underneath.
   */
  readonly task: ecs.TaskDefinition;
  /**
   * Load Balancer for connecting with the TestChain node.
   */
  readonly loadBalancer: elb.NetworkLoadBalancer;

  constructor(scope: cdk.Construct, id: string, props: TestChainProps = {}) {
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
