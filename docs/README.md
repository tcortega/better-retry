better-retry

# better-retry

## Table of contents

### Interfaces

- [FailedAttemptError](interfaces/FailedAttemptError.md)

### Type Aliases

- [Options](README.md#options)

### Functions

- [betterRetry](README.md#betterretry)

## Type Aliases

### Options

Ƭ **Options**: `WrapOptions` & { `onFailedAttempt?`: (`error`: [`FailedAttemptError`](interfaces/FailedAttemptError.md)) => `void` \| `Promise`<`void`\>  }

#### Defined in

[src/types.ts:8](https://github.com/tcortega/p-retry/blob/96bcfb0/src/types.ts#L8)

## Functions

### betterRetry

▸ **betterRetry**<`T`\>(`inputFunc`, `options?`): `Promise`<`T`\>

Returns a Promise that is fulfilled when calling inputFunc returns a fulfilled promise. If calling input returns a
rejected promise, inputFunc is called again until the maximum number of retries is reached. It then rejects with
the last rejection reason.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputFunc` | (`attempt`: `number`) => `T` \| `PromiseLike`<`T`\> | the function that will run until it succeeds or reach the retry limit. |
| `options?` | [`Options`](README.md#options) | Options to configure the retry behavior. |

#### Returns

`Promise`<`T`\>

a Promise that is fulfilled when the inputFunc returns a fulfilled promise.

#### Defined in

[src/betterRetry.ts:14](https://github.com/tcortega/p-retry/blob/96bcfb0/src/betterRetry.ts#L14)
