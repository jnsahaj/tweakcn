"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLineSplittingTransform = exports.Deferred = exports.TYPE_PREVIOUS_RESOLVED = exports.TYPE_URL = exports.TYPE_SYMBOL = exports.TYPE_SET = exports.TYPE_REGEXP = exports.TYPE_PROMISE = exports.TYPE_NULL_OBJECT = exports.TYPE_MAP = exports.TYPE_ERROR = exports.TYPE_DATE = exports.TYPE_BIGINT = exports.UNDEFINED = exports.POSITIVE_INFINITY = exports.NULL = exports.NEGATIVE_ZERO = exports.NEGATIVE_INFINITY = exports.NAN = exports.HOLE = void 0;
exports.HOLE = -1;
exports.NAN = -2;
exports.NEGATIVE_INFINITY = -3;
exports.NEGATIVE_ZERO = -4;
exports.NULL = -5;
exports.POSITIVE_INFINITY = -6;
exports.UNDEFINED = -7;
exports.TYPE_BIGINT = "B";
exports.TYPE_DATE = "D";
exports.TYPE_ERROR = "E";
exports.TYPE_MAP = "M";
exports.TYPE_NULL_OBJECT = "N";
exports.TYPE_PROMISE = "P";
exports.TYPE_REGEXP = "R";
exports.TYPE_SET = "S";
exports.TYPE_SYMBOL = "Y";
exports.TYPE_URL = "U";
exports.TYPE_PREVIOUS_RESOLVED = "Z";
class Deferred {
    promise;
    resolve;
    reject;
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
exports.Deferred = Deferred;
function createLineSplittingTransform() {
    const decoder = new TextDecoder();
    let leftover = "";
    return new TransformStream({
        transform(chunk, controller) {
            const str = decoder.decode(chunk, { stream: true });
            const parts = (leftover + str).split("\n");
            // The last part might be a partial line, so keep it for the next chunk.
            leftover = parts.pop() || "";
            for (const part of parts) {
                controller.enqueue(part);
            }
        },
        flush(controller) {
            // If there's any leftover data, enqueue it before closing.
            if (leftover) {
                controller.enqueue(leftover);
            }
        },
    });
}
exports.createLineSplittingTransform = createLineSplittingTransform;
