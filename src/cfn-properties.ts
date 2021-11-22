import { CloudFormationCustomResourceEventCommon } from "aws-lambda";

/**
 * Get a string from the ResourceProperties and throw an error if it does not exist or is not a string.
 *
 * @param properties resource properties - name value pairs from CloudFormation
 * @param name name of the property to get
 */
export function getString(
  event: CloudFormationCustomResourceEventCommon,
  name: string
): string {
  const prop = getStringOrUndefined(event, name);
  if (prop === undefined) {
    throw new Error(
      `expected a string resource property, '${name}', but got '${prop}'`
    );
  }
  return prop;
}

export function getStringOrUndefined(
  event: CloudFormationCustomResourceEventCommon,
  name: string
): string {
  const prop = event.ResourceProperties[name];
  if (prop === undefined || typeof prop === "string") {
    return prop;
  }
  throw new Error(
    `expected a string resource property, '${name}', but got '${prop}'`
  );
}

export function getNumberOrUndefined(
  event: CloudFormationCustomResourceEventCommon,
  name: string
): number | undefined {
  if (name in event.ResourceProperties) {
    return getNumber(event, name);
  } else {
    return undefined;
  }
}

export function getNumber(
  event: CloudFormationCustomResourceEventCommon,
  name: string
): number {
  const prop = event.ResourceProperties[name];
  if (typeof prop === "number") {
    return prop;
  } else if (typeof prop === "string") {
    try {
      return parseInt(prop, 10);
    } catch (err) {
      try {
        return parseFloat(prop);
      } catch {
        // no-op
      }
    }
  }
  throw new Error(
    `expected a number resource property, '${name}', but got '${prop}'`
  );
}
