import { FailedAttemptError, Options } from "./types";

const networkErrorMsgs = new Set([
  'Failed to fetch', // Chrome
  'NetworkError when attempting to fetch resource.', // Firefox
  'The Internet connection appears to be offline.', // Safari
  'Network request failed', // `cross-fetch`
  'fetch failed', // Undici (Node.js)
  'Request failed with status code', // Axios
  'Network Error', // Axios
  'Connection reset', // Axios
  'Connection refused', // Axios
  'ETIMEDOUT', // Axios
]);

export const isNetworkError = (errorMessage: string) => networkErrorMsgs.has(errorMessage);

export const decorateErrorWithCounts = (error: FailedAttemptError, attempt: number, options: Options) => {
  // Minus 1 from attempt because the first attempt does not count as a retry
  const retriesLeft = options.retries! - (attempt - 1);

  error.attempt = attempt;
  error.retriesLeft = retriesLeft;
  return error;
};
