import * as https from "https";
import * as url from "url";

import {
  CloudFormationCustomResourceEventCommon,
  CloudFormationCustomResourceResponse,
} from "aws-lambda";

/**
 * Success or Failure Response payloads of a CRUD operation..
 */
export type CloudFormationResponse = SuccessResponse | FailedResponse;

interface Response {
  PhysicalResourceId: CloudFormationCustomResourceResponse["PhysicalResourceId"];
  Data?: Record<string, any>;
}

/**
 * Successful CRUD operation.
 */
export interface SuccessResponse extends Response {
  Status: "SUCCESS";
}

/**
 * Failed CRUD operation.
 */
export interface FailedResponse extends Response {
  Status: "FAILED";
  /**
   * Reason why the operation failed.
   */
  Reason: string;
}

/**
 * Call back to CloudFormation.
 *
 * @param event CFN event we're responding to
 * @param body response body
 */
export async function callbackToCloudFormation(
  event: CloudFormationCustomResourceEventCommon,
  body: CloudFormationResponse
): Promise<void> {
  const payload = JSON.stringify({
    ...event,
    ...body,
  });
  console.log(payload);
  // TODO: utilize url.URL
  const parsedUrl = url.parse(event.ResponseURL);
  return new Promise<void>((resolve, reject) => {
    try {
      const request = https.request(
        {
          headers: {
            "content-type": "application/json",
            "content-length": payload.length,
          },
          hostname: parsedUrl.hostname,
          method: "PUT",
          path: parsedUrl.path,
          port: 443,
        },
        () => resolve()
      );
      request.on("error", reject);
      request.write(payload);
      request.end();
    } catch (err) {
      reject(err);
    }
  });
}
