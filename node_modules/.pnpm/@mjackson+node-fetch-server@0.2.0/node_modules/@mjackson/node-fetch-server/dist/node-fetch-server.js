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
export {
  createRequestListener
};
