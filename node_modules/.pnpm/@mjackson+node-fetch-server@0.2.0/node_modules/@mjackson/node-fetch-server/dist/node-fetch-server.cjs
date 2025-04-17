"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/node-fetch-server.ts
var node_fetch_server_exports = {};
__export(node_fetch_server_exports, {
  createRequestListener: () => createRequestListener
});
module.exports = __toCommonJS(node_fetch_server_exports);

// src/lib/request-listener.ts
function createRequestListener(handler, options) {
  let onError = (options == null ? void 0 : options.onError) ?? defaultErrorHandler;
  return async (req, res) => {
    let controller = new AbortController();
    res.on("close", () => {
      controller.abort();
    });
    let request = createRequest(req, controller.signal, options);
    let client = {
      address: req.socket.remoteAddress,
      family: req.socket.remoteFamily,
      port: req.socket.remotePort
    };
    let response;
    try {
      response = await handler(request, client);
    } catch (error) {
      try {
        response = await onError(error) ?? internalServerError();
      } catch (error2) {
        console.error(`There was an error in the error handler: ${error2}`);
        response = internalServerError();
      }
    }
    let rawHeaders = [];
    for (let [key, value] of response.headers) {
      rawHeaders.push(key, value);
    }
    res.writeHead(response.status, rawHeaders);
    if (response.body != null && req.method !== "HEAD") {
      for await (let chunk of response.body) {
        res.write(chunk);
      }
    }
    res.end();
  };
}
function defaultErrorHandler(error) {
  console.error(error);
  return internalServerError();
}
function internalServerError() {
  return new Response(
    // "Internal Server Error"
    new Uint8Array([
      73,
      110,
      116,
      101,
      114,
      110,
      97,
      108,
      32,
      83,
      101,
      114,
      118,
      101,
      114,
      32,
      69,
      114,
      114,
      111,
      114
    ]),
    {
      status: 500,
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
}
function createRequest(req, signal, options) {
  let method = req.method ?? "GET";
  let headers = createHeaders(req.rawHeaders);
  let protocol = (options == null ? void 0 : options.protocol) ?? ("encrypted" in req.socket && req.socket.encrypted ? "https:" : "http:");
  let host = (options == null ? void 0 : options.host) ?? headers.get("host") ?? "localhost";
  let url = new URL(req.url, `${protocol}//${host}`);
  let init = { method, headers, signal };
  if (method !== "GET" && method !== "HEAD") {
    init.body = new ReadableStream({
      start(controller) {
        req.on("data", (chunk) => {
          controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
        });
        req.on("end", () => {
          controller.close();
        });
      }
    });
    init.duplex = "half";
  }
  return new Request(url, init);
}
function createHeaders(rawHeaders) {
  let headers = new Headers();
  for (let i = 0; i < rawHeaders.length; i += 2) {
    headers.append(rawHeaders[i], rawHeaders[i + 1]);
  }
  return headers;
}
