import { CloudFormationCustomResourceEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

import * as ethers from "ethers";
import { callbackToCloudFormation, getString } from "./cfn-util";
import { EnvironmentKeys } from "./constants";

const s3 = new AWS.S3();

/**
 * Entrypoint to the Contract Deployer Lambda Function. This Function is called
 * as part of the CloudFormation CRUD lifecycle for the Custom::Contract Resource.
 */
export async function handle(event: CloudFormationCustomResourceEvent) {
  try {
    const bucketName = getString(event, EnvironmentKeys.ContractBucketName);
    const objectKey = getString(event, EnvironmentKeys.ContractObjectKey);

    const contractObject = await s3
      .getObject({
        Bucket: bucketName,
        Key: objectKey,
      })
      .promise();

    if (event.RequestType === "Create") {
      // TODO
      const contractFactory = ethers.ContractFactory.fromSolidity(
        contractObject.Body
      );
    }
  } catch (err) {
    await callbackToCloudFormation(event, {
      Status: "FAILED",
      PhysicalResourceId:
        event.RequestType === "Create" ? "" : event.PhysicalResourceId,
      Reason: (err as any).message,
    });
  }
}

// const factory = new ContractFactory(contractAbi, contractByteCode);

// // If your contract requires constructor args, you can specify them here
// const contract = await factory.deploy(deployArgs);

// console.log(contract.address);
// console.log(contract.deployTransaction);
