import { aE as LinkDescriptor, aB as MetaDescriptor, aT as ServerDataFrom, aU as ClientDataFrom, aV as Func, aW as unstable_MiddlewareNextFunction, E as Equal, u as unstable_RouterContextProvider, aX as Pretty } from '../../route-data-5OzAzQtT.js';
import { M as MiddlewareEnabled, A as AppLoadContext } from '../../future-ldDp5FKH.js';
import 'react';

type IsDefined<T> = Equal<T, undefined> extends true ? false : true;
type MaybePromise<T> = T | Promise<T>;
type RouteModule = {
    meta?: Func;
    links?: Func;
    headers?: Func;
    loader?: Func;
    clientLoader?: Func;
    action?: Func;
    clientAction?: Func;
    HydrateFallback?: unknown;
    default?: unknown;
    ErrorBoundary?: unknown;
    [key: string]: unknown;
};
type LinkDescriptors = LinkDescriptor[];
type RouteInfo = {
    parents: RouteInfo[];
    module: RouteModule;
    id: unknown;
    file: string;
    path: string;
    params: unknown;
    loaderData: unknown;
    actionData: unknown;
};
type MetaMatch<T extends RouteInfo> = Pretty<Pick<T, "id" | "params"> & {
    pathname: string;
    meta: MetaDescriptor[];
    data: T["loaderData"];
    handle?: unknown;
    error?: unknown;
}>;
type MetaMatches<T extends RouteInfo[]> = T extends [infer F extends RouteInfo, ...infer R extends RouteInfo[]] ? [MetaMatch<F>, ...MetaMatches<R>] : Array<MetaMatch<RouteInfo> | undefined>;
type CreateMetaArgs<T extends RouteInfo> = {
    /** This is the current router `Location` object. This is useful for generating tags for routes at specific paths or query parameters. */
    location: Location;
    /** {@link https://reactrouter.com/start/framework/routing#dynamic-segments Dynamic route params} for the current route. */
    params: T["params"];
    /** The return value for this route's server loader function */
    data: T["loaderData"];
    /** Thrown errors that trigger error boundaries will be passed to the meta function. This is useful for generating metadata for error pages. */
    error?: unknown;
    /** An array of the current {@link https://api.reactrouter.com/v7/interfaces/react_router.UIMatch.html route matches}, including parent route matches. */
    matches: MetaMatches<[...T["parents"], T]>;
};
type MetaDescriptors = MetaDescriptor[];
type HeadersArgs = {
    loaderHeaders: Headers;
    parentHeaders: Headers;
    actionHeaders: Headers;
    errorHeaders: Headers | undefined;
};
type IsHydrate<ClientLoader> = ClientLoader extends {
    hydrate: true;
} ? true : ClientLoader extends {
    hydrate: false;
} ? false : false;
type CreateLoaderData<T extends RouteModule> = _CreateLoaderData<ServerDataFrom<T["loader"]>, ClientDataFrom<T["clientLoader"]>, IsHydrate<T["clientLoader"]>, T extends {
    HydrateFallback: Func;
} ? true : false>;
type _CreateLoaderData<ServerLoaderData, ClientLoaderData, ClientLoaderHydrate extends boolean, HasHydrateFallback> = [
    HasHydrateFallback,
    ClientLoaderHydrate
] extends [true, true] ? IsDefined<ClientLoaderData> extends true ? ClientLoaderData : undefined : [
    IsDefined<ClientLoaderData>,
    IsDefined<ServerLoaderData>
] extends [true, true] ? ServerLoaderData | ClientLoaderData : IsDefined<ClientLoaderData> extends true ? ClientLoaderData : IsDefined<ServerLoaderData> extends true ? ServerLoaderData : undefined;
type CreateActionData<T extends RouteModule> = _CreateActionData<ServerDataFrom<T["action"]>, ClientDataFrom<T["clientAction"]>>;
type _CreateActionData<ServerActionData, ClientActionData> = Awaited<[
    IsDefined<ServerActionData>,
    IsDefined<ClientActionData>
] extends [true, true] ? ServerActionData | ClientActionData : IsDefined<ClientActionData> extends true ? ClientActionData : IsDefined<ServerActionData> extends true ? ServerActionData : undefined>;
type ClientDataFunctionArgs<T extends RouteInfo> = {
    /**
     * A {@link https://developer.mozilla.org/en-US/docs/Web/API/Request Fetch Request instance} which you can use to read the URL, the method, the "content-type" header, and the request body from the request.
     *
     * @note Because client data functions are called before a network request is made, the Request object does not include the headers which the browser automatically adds. React Router infers the "content-type" header from the enc-type of the form that performed the submission.
     **/
    request: Request;
    /**
     * {@link https://reactrouter.com/start/framework/routing#dynamic-segments Dynamic route params} for the current route.
     * @example
     * // app/routes.ts
     * route("teams/:teamId", "./team.tsx"),
     *
     * // app/team.tsx
     * export function clientLoader({
     *   params,
     * }: Route.ClientLoaderArgs) {
     *   params.teamId;
     *   //        ^ string
     * }
     **/
    params: T["params"];
    /**
     * When `future.unstable_middleware` is not enabled, this is undefined.
     *
     * When `future.unstable_middleware` is enabled, this is an instance of
     * `unstable_RouterContextProvider` and can be used to access context values
     * from your route middlewares.  You may pass in initial context values in your
     * `<HydratedRouter unstable_getContext>` prop
     */
    context: unstable_RouterContextProvider;
};
type ServerDataFunctionArgs<T extends RouteInfo> = {
    /** A {@link https://developer.mozilla.org/en-US/docs/Web/API/Request Fetch Request instance} which you can use to read the url, method, headers (such as cookies), and request body from the request. */
    request: Request;
    /**
     * {@link https://reactrouter.com/start/framework/routing#dynamic-segments Dynamic route params} for the current route.
     * @example
     * // app/routes.ts
     * route("teams/:teamId", "./team.tsx"),
     *
     * // app/team.tsx
     * export function loader({
     *   params,
     * }: Route.LoaderArgs) {
     *   params.teamId;
     *   //        ^ string
     * }
     **/
    params: T["params"];
    /**
     * Without `future.unstable_middleware` enabled, this is the context passed in
     * to your server adapter's `getLoadContext` function. It's a way to bridge the
     * gap between the adapter's request/response API with your React Router app.
     * It is only applicable if you are using a custom server adapter.
     *
     * With `future.unstable_middleware` enabled, this is an instance of
     * `unstable_RouterContextProvider` and can be used for type-safe access to
     * context value set in your route middlewares.  If you are using a custom
     * server adapter, you may provide an initial set of context values from your
     * `getLoadContext` function.
     */
    context: MiddlewareEnabled extends true ? unstable_RouterContextProvider : AppLoadContext;
};
type CreateServerMiddlewareFunction<T extends RouteInfo> = (args: ServerDataFunctionArgs<T>, next: unstable_MiddlewareNextFunction<Response>) => MaybePromise<Response | void>;
type CreateClientMiddlewareFunction<T extends RouteInfo> = (args: ClientDataFunctionArgs<T>, next: unstable_MiddlewareNextFunction<undefined>) => MaybePromise<void>;
type CreateServerLoaderArgs<T extends RouteInfo> = ServerDataFunctionArgs<T>;
type CreateClientLoaderArgs<T extends RouteInfo> = ClientDataFunctionArgs<T> & {
    /** This is an asynchronous function to get the data from the server loader for this route. On client-side navigations, this will make a {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API fetch} call to the React Router server loader. If you opt-into running your clientLoader on hydration, then this function will return the data that was already loaded on the server (via Promise.resolve). */
    serverLoader: () => Promise<ServerDataFrom<T["module"]["loader"]>>;
};
type CreateServerActionArgs<T extends RouteInfo> = ServerDataFunctionArgs<T>;
type CreateClientActionArgs<T extends RouteInfo> = ClientDataFunctionArgs<T> & {
    /** This is an asynchronous function that makes the {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API fetch} call to the React Router server action for this route. */
    serverAction: () => Promise<ServerDataFrom<T["module"]["action"]>>;
};
type CreateHydrateFallbackProps<T extends RouteInfo> = {
    params: T["params"];
    loaderData?: T["loaderData"];
    actionData?: T["actionData"];
};
type Match<T extends RouteInfo> = Pretty<Pick<T, "id" | "params"> & {
    pathname: string;
    data: T["loaderData"];
    handle: unknown;
}>;
type Matches<T extends RouteInfo[]> = T extends [infer F extends RouteInfo, ...infer R extends RouteInfo[]] ? [Match<F>, ...Matches<R>] : Array<Match<RouteInfo> | undefined>;
type CreateComponentProps<T extends RouteInfo> = {
    /**
     * {@link https://reactrouter.com/start/framework/routing#dynamic-segments Dynamic route params} for the current route.
     * @example
     * // app/routes.ts
     * route("teams/:teamId", "./team.tsx"),
     *
     * // app/team.tsx
     * export default function Component({
     *   params,
     * }: Route.ComponentProps) {
     *   params.teamId;
     *   //        ^ string
     * }
     **/
    params: T["params"];
    /** The data returned from the `loader` or `clientLoader` */
    loaderData: T["loaderData"];
    /** The data returned from the `action` or `clientAction` following an action submission. */
    actionData?: T["actionData"];
    /** An array of the current {@link https://api.reactrouter.com/v7/interfaces/react_router.UIMatch.html route matches}, including parent route matches. */
    matches: Matches<[...T["parents"], T]>;
};
type CreateErrorBoundaryProps<T extends RouteInfo> = {
    /**
     * {@link https://reactrouter.com/start/framework/routing#dynamic-segments Dynamic route params} for the current route.
     * @example
     * // app/routes.ts
     * route("teams/:teamId", "./team.tsx"),
     *
     * // app/team.tsx
     * export function ErrorBoundary({
     *   params,
     * }: Route.ErrorBoundaryProps) {
     *   params.teamId;
     *   //        ^ string
     * }
     **/
    params: T["params"];
    error: unknown;
    loaderData?: T["loaderData"];
    actionData?: T["actionData"];
};

export type { CreateActionData, CreateClientActionArgs, CreateClientLoaderArgs, CreateClientMiddlewareFunction, CreateComponentProps, CreateErrorBoundaryProps, CreateHydrateFallbackProps, CreateLoaderData, CreateMetaArgs, CreateServerActionArgs, CreateServerLoaderArgs, CreateServerMiddlewareFunction, HeadersArgs, LinkDescriptors, MetaDescriptors };
