import { WrapOptions } from "retry";

export interface FailedAttemptError extends Error {
    attempt: number;
    retriesLeft: number;
}

export interface Options extends WrapOptions {
  readonly onFailedAttempt?: (error: FailedAttemptError) => void | Promise<void>;
}
