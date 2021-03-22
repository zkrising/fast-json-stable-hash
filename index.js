/**
 * Stable Stringifies an object.
 * @param {*} obj - The object to stable stringify.
 * @returns A string
 */
function stringify(obj) {
    const type = typeof obj;

    if (type === "string") {
        return JSON.stringify(obj);
    } else if (Array.isArray(obj)) {
        let str = "[";

        let al = obj.length - 1;

        for (let i = 0; i < obj.length; i++) {
            str += stringify(obj[i]);

            if (i !== al) {
                str += ",";
            }
        }

        return `${str}]`;
    } else if (type === "object" && obj !== null) {
        let str = "{";
        let keys = Object.keys(obj).sort();

        let kl = keys.length - 1;

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            str += `${JSON.stringify(key)}:${stringify(obj[key])}`;

            if (i !== kl) {
                str += ",";
            }
        }

        return `${str}}`;
    } else if (type === "number" || type === "boolean" || obj === null) {
        // bool, num, null have correct auto-coercions
        return `${obj}`;
    } else {
        throw new TypeError(
            `Invalid JSON type of ${type}, value ${obj}. FJSS can only hash JSON objects.`
        );
    }
}

const crypto = require("crypto");

/**
 * Stably Hashes the object using a streaming algorithm.
 * Versus @see hash - This algorithm is SLOWER for smaller data (<10mb),
 * but significantly faster beyond that point.
 * @param {*} obj - The object to hash.
 * @param {*} alg - The algorithm to hash by. The default is sha256.
 * @param {*} options - The options to provide to the hashing algorithm. Default sets an encoding of "hex".
 * @returns A string
 */
function streamHash(obj, alg = "sha256", options = { defaultEncoding: "hex" }) {
    let hash = crypto.createHash(alg, options);

    function internalStreamingStringify(obj) {
        let type = typeof obj;

        if (type === "string") {
            hash.update(JSON.stringify(obj));
        } else if (Array.isArray(obj)) {
            hash.update("[");

            let al = obj.length - 1;

            for (let i = 0; i < obj.length; i++) {
                internalStreamingStringify(obj[i]);

                if (i !== al) {
                    hash.update(",");
                }
            }

            hash.update("]");
        } else if (type === "object" && obj !== null) {
            hash.update("{");

            let keys = Object.keys(obj).sort();

            let kl = keys.length - 1;

            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                hash.update(`${JSON.stringify(key)}:`);

                internalStreamingStringify(obj[key]);

                if (i !== kl) {
                    hash.update(",");
                }
            }

            hash.update("}");
        } else if (type === "number" || type === "boolean" || obj === null) {
            // bool, num, null have correct auto-coercions
            // note that we're using `${}` instead of .toString()
            // because null.toString() is an error.
            hash.update(`${obj}`);
        } else {
            // symbols are the only primitive to not implicitly stringify
            throw new TypeError(
                `Invalid JSON type of ${type}, value ${
                    type === "symbol" ? obj.toString() : obj
                }. FJSS can only hash JSON objects.`
            );
        }
    }

    internalStreamingStringify(obj);

    return hash.digest(options.defaultEncoding);
}

/**
 * Stably Hash an object. This is faster for smaller files (<10mb), but significantly slower
 * than streamingHash for larger files.
 * @param {*} obj - The object to hash.
 * @param {*} alg - The algorithm to hash with, default is sha256.
 * @param {*} options - The options to provide to the hashing algorithm. Default sets an encoding of "hex".
 * @returns A string
 */
function hash(obj, alg = "sha256", options = { defaultEncoding: "hex" }) {
    let data = stringify(obj);

    let hash = crypto.createHash(alg, options);

    hash.update(data);

    return hash.digest(options.defaultEncoding);
}

module.exports = {
    stringify: stringify,
    hash: hash,
    streamingHash: streamHash,
};
