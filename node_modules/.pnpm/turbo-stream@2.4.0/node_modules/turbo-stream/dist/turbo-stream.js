"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = void 0;
const flatten_js_1 = require("./flatten.js");
const unflatten_js_1 = require("./unflatten.js");
const utils_js_1 = require("./utils.js");
async function decode(readable, options) {
    const { plugins } = options ?? {};
    const done = new utils_js_1.Deferred();
    const reader = readable
        .pipeThrough((0, utils_js_1.createLineSplittingTransform)())
        .getReader();
    const decoder = {
        values: [],
        hydrated: [],
        deferred: {},
        plugins,
    };
    const decoded = await decodeInitial.call(decoder, reader);
    let donePromise = done.promise;
    if (decoded.done) {
        done.resolve();
    }
    else {
        donePromise = decodeDeferred
            .call(decoder, reader)
            .then(done.resolve)
            .catch((reason) => {
            for (const deferred of Object.values(decoder.deferred)) {
                deferred.reject(reason);
            }
            done.reject(reason);
        });
    }
    return {
        done: donePromise.then(() => reader.closed),
        value: decoded.value,
    };
}
exports.decode = decode;
async function decodeInitial(reader) {
    const read = await reader.read();
    if (!read.value) {
        throw new SyntaxError();
    }
    let line;
    try {
        line = JSON.parse(read.value);
    }
    catch (reason) {
        throw new SyntaxError();
    }
    return {
        done: read.done,
        value: unflatten_js_1.unflatten.call(this, line),
    };
}
async function decodeDeferred(reader) {
    let read = await reader.read();
    while (!read.done) {
        if (!read.value)
            continue;
        const line = read.value;
        switch (line[0]) {
            case utils_js_1.TYPE_PROMISE: {
                const colonIndex = line.indexOf(":");
                const deferredId = Number(line.slice(1, colonIndex));
                const deferred = this.deferred[deferredId];
                if (!deferred) {
                    throw new Error(`Deferred ID ${deferredId} not found in stream`);
                }
                const lineData = line.slice(colonIndex + 1);
                let jsonLine;
                try {
                    jsonLine = JSON.parse(lineData);
                }
                catch (reason) {
                    throw new SyntaxError();
                }
                const value = unflatten_js_1.unflatten.call(this, jsonLine);
                deferred.resolve(value);
                break;
            }
            case utils_js_1.TYPE_ERROR: {
                const colonIndex = line.indexOf(":");
                const deferredId = Number(line.slice(1, colonIndex));
                const deferred = this.deferred[deferredId];
                if (!deferred) {
                    throw new Error(`Deferred ID ${deferredId} not found in stream`);
                }
                const lineData = line.slice(colonIndex + 1);
                let jsonLine;
                try {
                    jsonLine = JSON.parse(lineData);
                }
                catch (reason) {
                    throw new SyntaxError();
                }
                const value = unflatten_js_1.unflatten.call(this, jsonLine);
                deferred.reject(value);
                break;
            }
            default:
                throw new SyntaxError();
        }
        read = await reader.read();
    }
}
function encode(input, options) {
    const { plugins, postPlugins, signal } = options ?? {};
    const encoder = {
        deferred: {},
        index: 0,
        indices: new Map(),
        stringified: [],
        plugins,
        postPlugins,
        signal,
    };
    const textEncoder = new TextEncoder();
    let lastSentIndex = 0;
    const readable = new ReadableStream({
        async start(controller) {
            const id = flatten_js_1.flatten.call(encoder, input);
            if (Array.isArray(id)) {
                throw new Error("This should never happen");
            }
            if (id < 0) {
                controller.enqueue(textEncoder.encode(`${id}\n`));
            }
            else {
                controller.enqueue(textEncoder.encode(`[${encoder.stringified.join(",")}]\n`));
                lastSentIndex = encoder.stringified.length - 1;
            }
            const seenPromises = new WeakSet();
            while (Object.keys(encoder.deferred).length > 0) {
                for (const [deferredId, deferred] of Object.entries(encoder.deferred)) {
                    if (seenPromises.has(deferred))
                        continue;
                    seenPromises.add((encoder.deferred[Number(deferredId)] = raceSignal(deferred, encoder.signal)
                        .then((resolved) => {
                        const id = flatten_js_1.flatten.call(encoder, resolved);
                        if (Array.isArray(id)) {
                            controller.enqueue(textEncoder.encode(`${utils_js_1.TYPE_PROMISE}${deferredId}:[["${utils_js_1.TYPE_PREVIOUS_RESOLVED}",${id[0]}]]\n`));
                            encoder.index++;
                            lastSentIndex++;
                        }
                        else if (id < 0) {
                            controller.enqueue(textEncoder.encode(`${utils_js_1.TYPE_PROMISE}${deferredId}:${id}\n`));
                        }
                        else {
                            const values = encoder.stringified
                                .slice(lastSentIndex + 1)
                                .join(",");
                            controller.enqueue(textEncoder.encode(`${utils_js_1.TYPE_PROMISE}${deferredId}:[${values}]\n`));
                            lastSentIndex = encoder.stringified.length - 1;
                        }
                    }, (reason) => {
                        if (!reason ||
                            typeof reason !== "object" ||
                            !(reason instanceof Error)) {
                            reason = new Error("An unknown error occurred");
                        }
                        const id = flatten_js_1.flatten.call(encoder, reason);
                        if (Array.isArray(id)) {
                            controller.enqueue(textEncoder.encode(`${utils_js_1.TYPE_ERROR}${deferredId}:[["${utils_js_1.TYPE_PREVIOUS_RESOLVED}",${id[0]}]]\n`));
                            encoder.index++;
                            lastSentIndex++;
                        }
                        else if (id < 0) {
                            controller.enqueue(textEncoder.encode(`${utils_js_1.TYPE_ERROR}${deferredId}:${id}\n`));
                        }
                        else {
                            const values = encoder.stringified
                                .slice(lastSentIndex + 1)
                                .join(",");
                            controller.enqueue(textEncoder.encode(`${utils_js_1.TYPE_ERROR}${deferredId}:[${values}]\n`));
                            lastSentIndex = encoder.stringified.length - 1;
                        }
                    })
                        .finally(() => {
                        delete encoder.deferred[Number(deferredId)];
                    })));
                }
                await Promise.race(Object.values(encoder.deferred));
            }
            await Promise.all(Object.values(encoder.deferred));
            controller.close();
        },
    });
    return readable;
}
exports.encode = encode;
function raceSignal(promise, signal) {
    if (!signal)
        return promise;
    if (signal.aborted)
        return Promise.reject(signal.reason || new Error("Signal was aborted."));
    const abort = new Promise((resolve, reject) => {
        signal.addEventListener("abort", (event) => {
            reject(signal.reason || new Error("Signal was aborted."));
        });
        promise.then(resolve).catch(reject);
    });
    abort.catch(() => { });
    return Promise.race([abort, promise]);
}
