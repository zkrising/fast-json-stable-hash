const t = require("tap");

const fjh = require("../index");

const baseObj = {
    b: 2,
    a: 1,
    c: 3,
};

const nestedObj = {
    b: 2,
    a: 1,
    c: {
        e: 5,
        d: 4,
    },
};

const deepRecursion = {
    b: 2,
    a: 1,
    c: {
        d: {
            h: {
                j: 10,
            },
            e: {
                f: {
                    g: {
                        i: 9,
                    },
                },
            },
        },
    },
};

const dataTypes = {
    b: true,
    a: 1,
    c: "foo",
    f: null,
    d: [1, "foo", true, [0, 1, 2], { e: [[]] }],
};

t.test("Stringify", (t) => {
    t.is(
        fjh.stringify(baseObj),
        '{"a":1,"b":2,"c":3}',
        "Basic Stringify test against simple object."
    );

    t.is(fjh.stringify(nestedObj), '{"a":1,"b":2,"c":{"d":4,"e":5}}', "Recursion Test");

    t.is(
        fjh.stringify(deepRecursion),
        '{"a":1,"b":2,"c":{"d":{"e":{"f":{"g":{"i":9}}},"h":{"j":10}}}}',
        "Deeper Recursion Test"
    );

    t.is(
        fjh.stringify(dataTypes),
        '{"a":1,"b":true,"c":"foo","d":[1,"foo",true,[0,1,2],{"e":[[]]}],"f":null}',
        "Complex Datatypes Test"
    );

    t.end();
});

t.test("Stringify Throws", (t) => {
    t.throws(() => fjh.stringify(() => true), "Rejects Function");
    t.throws(() => fjh.stringify(undefined), "Rejects undefined");
    t.throws(() => fjh.stringify(Symbol()), "Rejects Symbol");
    t.throws(() => fjh.stringify(2n), "Rejects BigInt");

    t.throws(() => fjh.streamingHash(() => true), "st Rejects Function");
    t.throws(() => fjh.streamingHash(undefined), "st Rejects undefined");
    t.throws(() => fjh.streamingHash(Symbol()), "st Rejects Symbol");
    t.throws(() => fjh.streamingHash(2n), "st Rejects BigInt");

    t.end();
});

t.test("Hashing", (t) => {
    t.is(
        fjh.hash(baseObj),
        "e6a3385fb77c287a712e7f406a451727f0625041823ecf23bea7ef39b2e39805",
        "Hash algorithm sanely hashes data"
    );

    t.is(fjh.hash(baseObj), fjh.streamingHash(baseObj), "Streaming Hash and stHash align");

    t.is(
        fjh.hash(deepRecursion),
        fjh.streamingHash(deepRecursion),
        "Streaming Hash and stHash align for deep recursion"
    );

    t.is(
        fjh.hash(nestedObj),
        fjh.streamingHash(nestedObj),
        "Streaming Hash and stHash align for nested objects"
    );

    t.is(
        fjh.hash(dataTypes),
        fjh.streamingHash(dataTypes),
        "Streaming Hash and stHash align for complex datatypes"
    );

    t.end();
});
