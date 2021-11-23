/**
 * Wraps a Promise with logging for success and failure.
 *
 * @param description description to include in the logging
 * @param promise promise we want to log success and failure messages for.
 * @returns a new Promise containing the value.
 */
export async function logPromise<T>(
  description: string,
  promise: Promise<T>
): Promise<T> {
  try {
    const result = await promise;
    console.log(`Success: ${description}`);
    return result;
  } catch (err) {
    console.error(`Failed: ${description}`, err);
    throw err;
  }
}
