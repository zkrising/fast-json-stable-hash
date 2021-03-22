const fjsh = require("../index.js");
const fs = require("fs");
const path = require("path");
const benchmark = require("benchmark");
// const JSum = require("jsum");
const fjss = require("fast-json-stable-stringify");
const jss = require("json-stable-stringify");
const fss = require("fast-stable-stringify");
const fsss = require("faster-stable-stringify");
const crypto = require("crypto");

const suite = new benchmark.Suite();

function SHA256(string) {
    let sha256 = crypto.createHash("sha256", { defaultEncoding: "hex" });

    sha256.update(string);

    return sha256.digest("hex");
}

function LoadData(name) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "./data", name)));
}

// large.json Data from https://github.com/zemirco/sf-city-lots-json - ~185MB
// medium.json Data from https://github.com/json-iterator/test-data - ~25MB
// small.json Data wrote by me, licensed under MIT. - ~1kb - this is more in line with what you'll typically be checksumming, probably.
const data = LoadData("small.json");

suite.add("FJC Standard Hash", () => {
    fjsh.hash(data);
});

suite.add("FJC Streaming Hash", () => {
    fjsh.streamingHash(data);
});

suite.add("fast-json-stable-stringify hash", () => {
    let d = fjss(data);
    SHA256(d);
});

suite.add("json-stable-stringify hash", () => {
    let d = jss(data);
    SHA256(d);
});

suite.add("fast-stable-stringify hash", () => {
    let d = fss(data);
    SHA256(d);
});

suite.add("faster-stable-stringify hash", () => {
    let d = fsss(data);
    SHA256(d);
});

// JSum is sadly broken: see https://github.com/fraunhoferfokus/JSum/issues/7
// It doing less operations means that its way, way faster than the other solutions here!

// JSum hash x 231,989 ops/sec ±5.55% (79 runs sampled)
// Fastest is JSum hash

// suite.add("JSum hash", () => {
//     JSum.digest(data, "sha256", "hex");
// });

suite.on("cycle", (event) => {
    // idk whats with this string ctor call but this is what the docs do
    console.log(String(event.target));
});

suite.on("complete", function () {
    console.log(`Fastest is ${this.filter("fastest").map("name")}`);
});

suite.run();
