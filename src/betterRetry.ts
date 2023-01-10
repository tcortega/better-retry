import { FailedAttemptError, Options } from "./types";
import retry, { RetryOperation } from "retry";
import { decorateErrorWithCounts, isNetworkError } from "./utils";

/**
 * Returns a Promise that is fulfilled when calling inputFunc returns a fulfilled promise. If calling input returns a
 * rejected promise, inputFunc is called again until the maximum number of retries is reached. It then rejects with
 * the last rejection reason.
 *
 * @param inputFunc the function that will run until it succeeds or reach the retry limit.
 * @param options Options to configure the retry behavior.
 * @returns a Promise that is fulfilled when the inputFunc returns a fulfilled promise.
 */
export async function betterRetry<T>(inputFunc: (attempt: number) => PromiseLike<T> | T, options?: Options): Promise<T> {
  options = {
    retries: 10,
    ...options
  };
  return new Promise((resolve, reject) => {
    const operation = retry.operation(options);
    operation.attempt(async attempt => await handleAttempt(inputFunc, operation, attempt, options!, resolve, reject));
  });
}

/**
 * Internal helper function that handles an attempt at calling the inputFunc and resolve or retry accordingly
 * @param inputFunc the function that will run until it succeeds or reach the retry limit.
 * @param operation the operation created using the retry lib.
 * @param attempt attempt number.
 * @param options retry options.
 * @param resolve the resolve function of the promise returned by betterRetry.
 * @param reject the reject function of the promise returned by betterRetry.
 */
async function handleAttempt<T>(inputFunc: (attempt: number) => (PromiseLike<T> | T), operation: RetryOperation, attempt: number, options: Options, resolve: (value: (PromiseLike<T> | T)) => void, reject: (reason?: any) => void) {
  try {
    resolve(await inputFunc(attempt));
  } catch (error) {
    if (!(error instanceof Error)) {
      reject(new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`));
      return;
    }

    if (error instanceof TypeError && !isNetworkError(error.message)) {
      operation.stop();
      reject(error);
      return;
    }

    const failedAttemptError = error as FailedAttemptError;
    decorateErrorWithCounts(failedAttemptError, attempt, options);

    if (options.onFailedAttempt) {
      try {
        await options.onFailedAttempt(failedAttemptError);
      } catch (error) {
        reject(error);
        return;
      }
    }

    if (!operation.retry(error)) {
      reject(operation.mainError());
    }
  }
}
