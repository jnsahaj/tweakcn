"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unflatten = void 0;
const utils_js_1 = require("./utils.js");
const globalObj = (typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
        ? globalThis
        : undefined);
function unflatten(parsed) {
    const { hydrated, values } = this;
    if (typeof parsed === "number")
        return hydrate.call(this, parsed);
    if (!Array.isArray(parsed) || !parsed.length)
        throw new SyntaxError();
    const startIndex = values.length;
    for (const value of parsed) {
        values.push(value);
    }
    hydrated.length = values.length;
    return hydrate.call(this, startIndex);
}
exports.unflatten = unflatten;
function hydrate(index) {
    const { hydrated, values, deferred, plugins } = this;
    let result;
    const stack = [
        [
            index,
            (v) => {
                result = v;
            },
        ],
    ];
    let postRun = [];
    while (stack.length > 0) {
        const [index, set] = stack.pop();
        switch (index) {
            case utils_js_1.UNDEFINED:
                set(undefined);
                continue;
            case utils_js_1.NULL:
                set(null);
                continue;
            case utils_js_1.NAN:
                set(NaN);
                continue;
            case utils_js_1.POSITIVE_INFINITY:
                set(Infinity);
                continue;
            case utils_js_1.NEGATIVE_INFINITY:
                set(-Infinity);
                continue;
            case utils_js_1.NEGATIVE_ZERO:
                set(-0);
                continue;
        }
        if (hydrated[index]) {
            set(hydrated[index]);
            continue;
        }
        const value = values[index];
        if (!value || typeof value !== "object") {
            hydrated[index] = value;
            set(value);
            continue;
        }
        if (Array.isArray(value)) {
            if (typeof value[0] === "string") {
                const [type, b, c] = value;
                switch (type) {
                    case utils_js_1.TYPE_DATE:
                        set((hydrated[index] = new Date(b)));
                        continue;
                    case utils_js_1.TYPE_URL:
                        set((hydrated[index] = new URL(b)));
                        continue;
                    case utils_js_1.TYPE_BIGINT:
                        set((hydrated[index] = BigInt(b)));
                        continue;
                    case utils_js_1.TYPE_REGEXP:
                        set((hydrated[index] = new RegExp(b, c)));
                        continue;
                    case utils_js_1.TYPE_SYMBOL:
                        set((hydrated[index] = Symbol.for(b)));
                        continue;
                    case utils_js_1.TYPE_SET:
                        const newSet = new Set();
                        hydrated[index] = newSet;
                        for (let i = 1; i < value.length; i++)
                            stack.push([
                                value[i],
                                (v) => {
                                    newSet.add(v);
                                },
                            ]);
                        set(newSet);
                        continue;
                    case utils_js_1.TYPE_MAP:
                        const map = new Map();
                        hydrated[index] = map;
                        for (let i = 1; i < value.length; i += 2) {
                            const r = [];
                            stack.push([
                                value[i + 1],
                                (v) => {
                                    r[1] = v;
                                },
                            ]);
                            stack.push([
                                value[i],
                                (k) => {
                                    r[0] = k;
                                },
                            ]);
                            postRun.push(() => {
                                map.set(r[0], r[1]);
                            });
                        }
                        set(map);
                        continue;
                    case utils_js_1.TYPE_NULL_OBJECT:
                        const obj = Object.create(null);
                        hydrated[index] = obj;
                        for (const key of Object.keys(b).reverse()) {
                            const r = [];
                            stack.push([
                                b[key],
                                (v) => {
                                    r[1] = v;
                                },
                            ]);
                            stack.push([
                                Number(key.slice(1)),
                                (k) => {
                                    r[0] = k;
                                },
                            ]);
                            postRun.push(() => {
                                obj[r[0]] = r[1];
                            });
                        }
                        set(obj);
                        continue;
                    case utils_js_1.TYPE_PROMISE:
                        if (hydrated[b]) {
                            set((hydrated[index] = hydrated[b]));
                        }
                        else {
                            const d = new utils_js_1.Deferred();
                            deferred[b] = d;
                            set((hydrated[index] = d.promise));
                        }
                        continue;
                    case utils_js_1.TYPE_ERROR:
                        const [, message, errorType] = value;
                        let error = errorType && globalObj && globalObj[errorType]
                            ? new globalObj[errorType](message)
                            : new Error(message);
                        hydrated[index] = error;
                        set(error);
                        continue;
                    case utils_js_1.TYPE_PREVIOUS_RESOLVED:
                        set((hydrated[index] = hydrated[b]));
                        continue;
                    default:
                        // Run plugins at the end so we have a chance to resolve primitives
                        // without running into a loop
                        if (Array.isArray(plugins)) {
                            const r = [];
                            const vals = value.slice(1);
                            for (let i = 0; i < vals.length; i++) {
                                const v = vals[i];
                                stack.push([
                                    v,
                                    (v) => {
                                        r[i] = v;
                                    },
                                ]);
                            }
                            postRun.push(() => {
                                for (const plugin of plugins) {
                                    const result = plugin(value[0], ...r);
                                    if (result) {
                                        set((hydrated[index] = result.value));
                                        return;
                                    }
                                }
                                throw new SyntaxError();
                            });
                            continue;
                        }
                        throw new SyntaxError();
                }
            }
            else {
                const array = [];
                hydrated[index] = array;
                for (let i = 0; i < value.length; i++) {
                    const n = value[i];
                    if (n !== utils_js_1.HOLE) {
                        stack.push([
                            n,
                            (v) => {
                                array[i] = v;
                            },
                        ]);
                    }
                }
                set(array);
                continue;
            }
        }
        else {
            const object = {};
            hydrated[index] = object;
            for (const key of Object.keys(value).reverse()) {
                const r = [];
                stack.push([
                    value[key],
                    (v) => {
                        r[1] = v;
                    },
                ]);
                stack.push([
                    Number(key.slice(1)),
                    (k) => {
                        r[0] = k;
                    },
                ]);
                postRun.push(() => {
                    object[r[0]] = r[1];
                });
            }
            set(object);
            continue;
        }
    }
    while (postRun.length > 0) {
        postRun.pop()();
    }
    return result;
}
