import * as http from 'node:http';

interface ClientAddress {
    /**
     * The IP address of the client that sent the request.
     *
     * [Node.js Reference](https://nodejs.org/api/net.html#socketremoteaddress)
     */
    address: string;
    /**
     * The family of the client IP address.
     *
     * [Node.js Reference](https://nodejs.org/api/net.html#socketremotefamily)
     */
    family: 'IPv4' | 'IPv6';
    /**
     * The remote port of the client that sent the request.
     *
     * [Node.js Reference](https://nodejs.org/api/net.html#socketremoteport)
     */
    port: number;
}
/**
 * A function that handles an error that occurred during request handling. May return a response to
 * send to the client, or `undefined` to allow the server to send a default error response.
 *
 * [MDN `Response` Reference](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 */
interface ErrorHandler {
    (error: unknown): void | Response | Promise<void | Response>;
}
/**
 * A function that handles an incoming request and returns a response.
 *
 * [MDN `Request` Reference](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 *
 * [MDN `Response` Reference](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 */
interface FetchHandler {
    (request: Request, client: ClientAddress): Response | Promise<Response>;
}

interface RequestListenerOptions {
    /**
     * Overrides the host portion of the incoming request URL. By default the request URL host is
     * derived from the HTTP `Host` header.
     *
     * For example, if you have a `$HOST` environment variable that contains the hostname of your
     * server, you can use it to set the host of all incoming request URLs like so:
     *
     * ```ts
     * createRequestListener(handler, { host: process.env.HOST })
     * ```
     */
    host?: string;
    /**
     * An error handler that determines the response when the request handler throws an error. By
     * default a 500 Internal Server Error response will be sent.
     */
    onError?: ErrorHandler;
    /**
     * Overrides the protocol of the incoming request URL. By default the request URL protocol is
     * derived from the connection protocol. So e.g. when serving over HTTPS (using
     * `https.createServer()`), the request URL will begin with `https:`.
     */
    protocol?: string;
}
/**
 * Wraps a fetch handler in a Node.js `http.RequestListener` that can be used with
 * `http.createServer()` or `https.createServer()`.
 *
 * ```ts
 * import * as http from 'node:http';
 * import { type FetchHandler, createRequestListener } from '@mjackson/node-fetch-server';
 *
 * let handler: FetchHandler = async (request) => {
 *   return new Response('Hello, world!');
 * };
 *
 * let server = http.createServer(
 *   createRequestListener(handler)
 * );
 *
 * server.listen(3000);
 * ```
 */
declare function createRequestListener(handler: FetchHandler, options?: RequestListenerOptions): http.RequestListener;

export { type ClientAddress, type ErrorHandler, type FetchHandler, type RequestListenerOptions, createRequestListener };
