# fast-json-stable-hash

Fast JSON Stable Hash (pronounced fish) is a fast, stable JSON hashing library.

## Stable

The algorithm is stable for different orders of keys. For example,

```json
{
  "a": 1,
  "b": 2
}
```

is semantically identical to

```json
{
  "b": 2,
  "a": 1
}
```

yet a naive JSON hashing algorithm will say the two are different. This library ensures keys are sorted before hashing.

## Fast

Benchmarks can be ran with `node benchmarks/benchmark.js`.

Tested on an intel i5 4690.

```
FJSH Standard Hash x 270,699 ops/sec ±0.60% (93 runs sampled)
FJSH Streaming Hash x 108,003 ops/sec ±0.34% (94 runs sampled)
fast-json-stable-stringify hash x 170,976 ops/sec ±2.03% (85 runs sampled)
json-stable-stringify hash x 147,094 ops/sec ±0.80% (94 runs sampled)
fast-stable-stringify hash x 270,740 ops/sec ±1.46% (91 runs sampled)
faster-stable-stringify hash x 186,555 ops/sec ±0.96% (89 runs sampled)
Fastest is FJSH Standard Hash
```

Note that `fast-stable-stringify` is about as fast as us, and the performance difference is not that significant.

## Install

```npm i fast-json-stable-hash```

## Usage

Hashing an object is simple.

```js
const fjsh = require("fast-json-stable-hash");

const myJsonObj = {
  b: 1,
  a: null,
  d: ["foo","bar"],
  c: true
};

fjsh.hash(myJsonObj); // a25dc1363f758963382cae759d5d9a3a5ca3c1c9e39dae04c6436b5bf5fb2d40
```

You can also stringify an object.
```js
fjsh.stringify(myJsonObj); // "{"a":null,"b":1,"c":true,"d":["foo","bar"]}"
```

A third algorithm - `streamingHash` - is available for **VERY LARGE** JSON documents.

This algorithm is **SIGNIFICANTLY SLOWER** than `hash` for things less than around 10 MB, But is *way* more efficient beyond that point.

It streams the string of data into the hashing algorithm, instead of appending it all to one long string and then throwing it into the hashing algorithm.

```js
fjsh.streamingHash(myJsonObj);
```
