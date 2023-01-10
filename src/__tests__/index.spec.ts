import { betterRetry } from "../betterRetry";

const defaultOptions = {retries: 5, maxTimeout: 10, minTimeout: 10};

describe('better-retry', () => {
  it('Should pass after 5 iterations', async () => {
    let count = 0;
    const testFunc = () => {
      if (count < 5) {
        count++;
        throw Error('Iteration has not reached 5 yet.');
      }

      return 'Success!';
    };

    const result = await betterRetry(testFunc, defaultOptions);
    expect(result).toBe('Success!');
    expect(count).toBe(5);
  });

  it('Should throw TypeError when an unknown error is thrown', async () => {
    const testFunc = () => {
      throw 'Unknown error';
    };

    await expect(betterRetry(testFunc)).rejects.toThrow(TypeError);
  });

  it('Should stop after a TypeError', async () => {
    let count = 0;
    const testFunc = () => {
      count++; // Sets it to 1.
      throw new TypeError();
    };

    await expect(betterRetry(testFunc)).rejects.toThrow();
    expect(count).toBe(1);
  });

  it('Should not stop if the TypeError is a Network Error', async () => {
    let count = -1; // First iteration is not counted as a retry
    const testFunc = () => {
      count++; // Sets it to 1.
      throw new TypeError('ETIMEDOUT');
    };

    await expect(betterRetry(testFunc, defaultOptions)).rejects.toThrow();
    expect(count).toBe(5);
  });

  it('Should send failed attempt messages', async () => {
    let receivedFailedMessage = false;
    const onFailedAttempt = () => {
      receivedFailedMessage = true;
    };

    const testFunc = () => {
      throw new Error();
    };

    await expect(betterRetry(testFunc, {...defaultOptions, retries: 1, onFailedAttempt})).rejects.toThrow();
    expect(receivedFailedMessage).toBe(true);
  });

  it('Should reject when there is something wrong with the onFailedAttempt function', async () => {
    const onFailedAttempt = () => {
      throw new Error();
    };

    let count = 0;
    const testFunc = () => {
      count++;
      throw new Error();
    };

    await expect(betterRetry(testFunc, {...defaultOptions, onFailedAttempt})).rejects.toThrow();
    expect(count).toBe(1);
  });
});
