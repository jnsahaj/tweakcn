"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = void 0;
const utils_js_1 = require("./utils.js");
function flatten(input) {
    const { indices } = this;
    const existing = indices.get(input);
    if (existing)
        return [existing];
    if (input === undefined)
        return utils_js_1.UNDEFINED;
    if (input === null)
        return utils_js_1.NULL;
    if (Number.isNaN(input))
        return utils_js_1.NAN;
    if (input === Number.POSITIVE_INFINITY)
        return utils_js_1.POSITIVE_INFINITY;
    if (input === Number.NEGATIVE_INFINITY)
        return utils_js_1.NEGATIVE_INFINITY;
    if (input === 0 && 1 / input < 0)
        return utils_js_1.NEGATIVE_ZERO;
    const index = this.index++;
    indices.set(input, index);
    stringify.call(this, input, index);
    return index;
}
exports.flatten = flatten;
function stringify(input, index) {
    const { deferred, plugins, postPlugins } = this;
    const str = this.stringified;
    const stack = [[input, index]];
    while (stack.length > 0) {
        const [input, index] = stack.pop();
        const partsForObj = (obj) => Object.keys(obj)
            .map((k) => `"_${flatten.call(this, k)}":${flatten.call(this, obj[k])}`)
            .join(",");
        let error = null;
        switch (typeof input) {
            case "boolean":
            case "number":
            case "string":
                str[index] = JSON.stringify(input);
                break;
            case "bigint":
                str[index] = `["${utils_js_1.TYPE_BIGINT}","${input}"]`;
                break;
            case "symbol": {
                const keyFor = Symbol.keyFor(input);
                if (!keyFor) {
                    error = new Error("Cannot encode symbol unless created with Symbol.for()");
                }
                else {
                    str[index] = `["${utils_js_1.TYPE_SYMBOL}",${JSON.stringify(keyFor)}]`;
                }
                break;
            }
            case "object": {
                if (!input) {
                    str[index] = `${utils_js_1.NULL}`;
                    break;
                }
                const isArray = Array.isArray(input);
                let pluginHandled = false;
                if (!isArray && plugins) {
                    for (const plugin of plugins) {
                        const pluginResult = plugin(input);
                        if (Array.isArray(pluginResult)) {
                            pluginHandled = true;
                            const [pluginIdentifier, ...rest] = pluginResult;
                            str[index] = `[${JSON.stringify(pluginIdentifier)}`;
                            if (rest.length > 0) {
                                str[index] += `,${rest
                                    .map((v) => flatten.call(this, v))
                                    .join(",")}`;
                            }
                            str[index] += "]";
                            break;
                        }
                    }
                }
                if (!pluginHandled) {
                    let result = isArray ? "[" : "{";
                    if (isArray) {
                        for (let i = 0; i < input.length; i++)
                            result +=
                                (i ? "," : "") +
                                    (i in input ? flatten.call(this, input[i]) : utils_js_1.HOLE);
                        str[index] = `${result}]`;
                    }
                    else if (input instanceof Date) {
                        str[index] = `["${utils_js_1.TYPE_DATE}",${input.getTime()}]`;
                    }
                    else if (input instanceof URL) {
                        str[index] = `["${utils_js_1.TYPE_URL}",${JSON.stringify(input.href)}]`;
                    }
                    else if (input instanceof RegExp) {
                        str[index] = `["${utils_js_1.TYPE_REGEXP}",${JSON.stringify(input.source)},${JSON.stringify(input.flags)}]`;
                    }
                    else if (input instanceof Set) {
                        if (input.size > 0) {
                            str[index] = `["${utils_js_1.TYPE_SET}",${[...input]
                                .map((val) => flatten.call(this, val))
                                .join(",")}]`;
                        }
                        else {
                            str[index] = `["${utils_js_1.TYPE_SET}"]`;
                        }
                    }
                    else if (input instanceof Map) {
                        if (input.size > 0) {
                            str[index] = `["${utils_js_1.TYPE_MAP}",${[...input]
                                .flatMap(([k, v]) => [
                                flatten.call(this, k),
                                flatten.call(this, v),
                            ])
                                .join(",")}]`;
                        }
                        else {
                            str[index] = `["${utils_js_1.TYPE_MAP}"]`;
                        }
                    }
                    else if (input instanceof Promise) {
                        str[index] = `["${utils_js_1.TYPE_PROMISE}",${index}]`;
                        deferred[index] = input;
                    }
                    else if (input instanceof Error) {
                        str[index] = `["${utils_js_1.TYPE_ERROR}",${JSON.stringify(input.message)}`;
                        if (input.name !== "Error") {
                            str[index] += `,${JSON.stringify(input.name)}`;
                        }
                        str[index] += "]";
                    }
                    else if (Object.getPrototypeOf(input) === null) {
                        str[index] = `["${utils_js_1.TYPE_NULL_OBJECT}",{${partsForObj(input)}}]`;
                    }
                    else if (isPlainObject(input)) {
                        str[index] = `{${partsForObj(input)}}`;
                    }
                    else {
                        error = new Error("Cannot encode object with prototype");
                    }
                }
                break;
            }
            default: {
                const isArray = Array.isArray(input);
                let pluginHandled = false;
                if (!isArray && plugins) {
                    for (const plugin of plugins) {
                        const pluginResult = plugin(input);
                        if (Array.isArray(pluginResult)) {
                            pluginHandled = true;
                            const [pluginIdentifier, ...rest] = pluginResult;
                            str[index] = `[${JSON.stringify(pluginIdentifier)}`;
                            if (rest.length > 0) {
                                str[index] += `,${rest
                                    .map((v) => flatten.call(this, v))
                                    .join(",")}`;
                            }
                            str[index] += "]";
                            break;
                        }
                    }
                }
                if (!pluginHandled) {
                    error = new Error("Cannot encode function or unexpected type");
                }
            }
        }
        if (error) {
            let pluginHandled = false;
            if (postPlugins) {
                for (const plugin of postPlugins) {
                    const pluginResult = plugin(input);
                    if (Array.isArray(pluginResult)) {
                        pluginHandled = true;
                        const [pluginIdentifier, ...rest] = pluginResult;
                        str[index] = `[${JSON.stringify(pluginIdentifier)}`;
                        if (rest.length > 0) {
                            str[index] += `,${rest
                                .map((v) => flatten.call(this, v))
                                .join(",")}`;
                        }
                        str[index] += "]";
                        break;
                    }
                }
            }
            if (!pluginHandled) {
                throw error;
            }
        }
    }
}
const objectProtoNames = Object.getOwnPropertyNames(Object.prototype)
    .sort()
    .join("\0");
function isPlainObject(thing) {
    const proto = Object.getPrototypeOf(thing);
    return (proto === Object.prototype ||
        proto === null ||
        Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames);
}
