better-retry
===========================

A better way to handle retries on promise-returning/async functions, with ESM, CJS, AMD and UMD support.   
It is basically [p-retry](https://github.com/sindresorhus/p-retry) rewritten in Typescript with Commonjs support.

# 🎉 Features

* Exponential backoff
* Custom retry strategy support
* Timeout settings

# 📝 To-do

* Add custom abort signal handlers

# ⚙ Install

```bash
# npm
npm i better-retry

# yarn
yarn add better-retry
```

# 📖 Docs

You can read docs [here](./docs/README.md).

# 🔍 Usage

```ts
import { betterRetry, FailedAttemptError } from 'better-retry';

const run = async (attempt: number) => {
  if (attempt > 5) return 'Success!';

  throw new Error('Failed');
};

const onError = (error: FailedAttemptError) => {
  console.log(`Attempt ${error.attempt} failed. There are ${error.retriesLeft} retries left.`);
}

console.log(await betterRetry(run), { retries: 5, onFailedAttempt: onError }); // Success!
```

# ️❤️ Contributing

Every contribution is really welcome!

If you feel that something can be improved or should be fixed, feel free to open an issue with the feature or the bug found.

If you want to fork and open a pull request (adding features or fixes), feel free to do it. Remember only to use the `dev` branch as a base.

Read the [contributing guidelines](./CONTRIBUTING.md)

# 📃 Licence

Read the [licence](./LICENCE)
