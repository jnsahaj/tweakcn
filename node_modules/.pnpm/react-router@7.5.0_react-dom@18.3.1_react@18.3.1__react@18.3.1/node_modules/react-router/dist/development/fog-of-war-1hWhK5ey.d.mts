import * as React from 'react';
import { k as RouteObject, R as RouterInit, F as FutureConfig$1, H as HydrationState, I as InitialEntry, D as DataStrategyFunction, ar as PatchRoutesOnNavigationFunction, b as Router$1, T as To, d as RelativeRoutingType, x as NonIndexRouteObject, a2 as LazyRouteFunction, s as IndexRouteObject, e as Location, f as Action, aq as Navigator, at as RouteMatch, p as StaticHandlerContext, c as RouteManifest, a as RouteModules, ap as DataRouteObject, aR as RouteModule, a1 as HTMLFormMethod, $ as FormEncType, aC as PageLinkDescriptor, aS as History, z as GetScrollRestorationKeyFunction, N as NavigateOptions, J as Fetcher, n as SerializeFrom, B as BlockerFunction } from './route-data-5OzAzQtT.mjs';

/**
 * @private
 */
declare function mapRouteProperties(route: RouteObject): Partial<RouteObject> & {
    hasErrorBoundary: boolean;
};
interface MemoryRouterOpts {
    /**
     * Basename path for the application.
     */
    basename?: string;
    /**
     * Function to provide the initial context values for all client side navigations/fetches
     */
    unstable_getContext?: RouterInit["unstable_getContext"];
    /**
     * Future flags to enable for the router.
     */
    future?: Partial<FutureConfig$1>;
    /**
     * Hydration data to initialize the router with if you have already performed
     * data loading on the server.
     */
    hydrationData?: HydrationState;
    /**
     * Initial entires in the in-memory history stack
     */
    initialEntries?: InitialEntry[];
    /**
     * Index of `initialEntries` the application should initialize to
     */
    initialIndex?: number;
    /**
     * Override the default data strategy of loading in parallel.
     * Only intended for advanced usage.
     */
    dataStrategy?: DataStrategyFunction;
    /**
     * Lazily define portions of the route tree on navigations.
     */
    patchRoutesOnNavigation?: PatchRoutesOnNavigationFunction;
}
/**
 * Create a new data router that manages the application path using an in-memory
 * history stack.  Useful for non-browser environments without a DOM API.
 *
 * @category Data Routers
 */
declare function createMemoryRouter(
/**
 * Application routes
 */
routes: RouteObject[], 
/**
 * Router options
 */
opts?: MemoryRouterOpts): Router$1;
interface RouterProviderProps {
    router: Router$1;
    flushSync?: (fn: () => unknown) => undefined;
}
/**
 * Given a Remix Router instance, render the appropriate UI
 */
declare function RouterProvider({ router, flushSync: reactDomFlushSyncImpl, }: RouterProviderProps): React.ReactElement;
/**
 * @category Types
 */
interface MemoryRouterProps {
    basename?: string;
    children?: React.ReactNode;
    initialEntries?: InitialEntry[];
    initialIndex?: number;
}
/**
 * A `<Router>` that stores all entries in memory.
 *
 * @category Component Routers
 */
declare function MemoryRouter({ basename, children, initialEntries, initialIndex, }: MemoryRouterProps): React.ReactElement;
/**
 * @category Types
 */
interface NavigateProps {
    to: To;
    replace?: boolean;
    state?: any;
    relative?: RelativeRoutingType;
}
/**
 * A component-based version of {@link useNavigate} to use in a [`React.Component
 * Class`](https://reactjs.org/docs/react-component.html) where hooks are not
 * able to be used.
 *
 * It's recommended to avoid using this component in favor of {@link useNavigate}
 *
 * @category Components
 */
declare function Navigate({ to, replace, state, relative, }: NavigateProps): null;
/**
 * @category Types
 */
interface OutletProps {
    /**
      Provides a context value to the element tree below the outlet. Use when the parent route needs to provide values to child routes.
  
      ```tsx
      <Outlet context={myContextValue} />
      ```
  
      Access the context with {@link useOutletContext}.
     */
    context?: unknown;
}
/**
  Renders the matching child route of a parent route or nothing if no child route matches.

  ```tsx
  import { Outlet } from "react-router"

  export default function SomeParent() {
    return (
      <div>
        <h1>Parent Content</h1>
        <Outlet />
      </div>
    );
  }
  ```

  @category Components
 */
declare function Outlet(props: OutletProps): React.ReactElement | null;
/**
 * @category Types
 */
interface PathRouteProps {
    caseSensitive?: NonIndexRouteObject["caseSensitive"];
    path?: NonIndexRouteObject["path"];
    id?: NonIndexRouteObject["id"];
    lazy?: LazyRouteFunction<NonIndexRouteObject>;
    loader?: NonIndexRouteObject["loader"];
    action?: NonIndexRouteObject["action"];
    hasErrorBoundary?: NonIndexRouteObject["hasErrorBoundary"];
    shouldRevalidate?: NonIndexRouteObject["shouldRevalidate"];
    handle?: NonIndexRouteObject["handle"];
    index?: false;
    children?: React.ReactNode;
    element?: React.ReactNode | null;
    hydrateFallbackElement?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
    Component?: React.ComponentType | null;
    HydrateFallback?: React.ComponentType | null;
    ErrorBoundary?: React.ComponentType | null;
}
/**
 * @category Types
 */
interface LayoutRouteProps extends PathRouteProps {
}
/**
 * @category Types
 */
interface IndexRouteProps {
    caseSensitive?: IndexRouteObject["caseSensitive"];
    path?: IndexRouteObject["path"];
    id?: IndexRouteObject["id"];
    lazy?: LazyRouteFunction<IndexRouteObject>;
    loader?: IndexRouteObject["loader"];
    action?: IndexRouteObject["action"];
    hasErrorBoundary?: IndexRouteObject["hasErrorBoundary"];
    shouldRevalidate?: IndexRouteObject["shouldRevalidate"];
    handle?: IndexRouteObject["handle"];
    index: true;
    children?: undefined;
    element?: React.ReactNode | null;
    hydrateFallbackElement?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
    Component?: React.ComponentType | null;
    HydrateFallback?: React.ComponentType | null;
    ErrorBoundary?: React.ComponentType | null;
}
type RouteProps = PathRouteProps | LayoutRouteProps | IndexRouteProps;
/**
 * Configures an element to render when a pattern matches the current location.
 * It must be rendered within a {@link Routes} element. Note that these routes
 * do not participate in data loading, actions, code splitting, or any other
 * route module features.
 *
 * @category Components
 */
declare function Route$1(_props: RouteProps): React.ReactElement | null;
/**
 * @category Types
 */
interface RouterProps {
    basename?: string;
    children?: React.ReactNode;
    location: Partial<Location> | string;
    navigationType?: Action;
    navigator: Navigator;
    static?: boolean;
}
/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a `<Router>` directly. Instead, you'll render a
 * router that is more specific to your environment such as a `<BrowserRouter>`
 * in web browsers or a `<StaticRouter>` for server rendering.
 *
 * @category Components
 */
declare function Router({ basename: basenameProp, children, location: locationProp, navigationType, navigator, static: staticProp, }: RouterProps): React.ReactElement | null;
/**
 * @category Types
 */
interface RoutesProps {
    /**
     * Nested {@link Route} elements
     */
    children?: React.ReactNode;
    /**
     * The location to match against. Defaults to the current location.
     */
    location?: Partial<Location> | string;
}
/**
 Renders a branch of {@link Route | `<Routes>`} that best matches the current
 location. Note that these routes do not participate in data loading, actions,
 code splitting, or any other route module features.

 ```tsx
 import { Routes, Route } from "react-router"

<Routes>
  <Route index element={<StepOne />} />
  <Route path="step-2" element={<StepTwo />} />
  <Route path="step-3" element={<StepThree />}>
</Routes>
 ```

 @category Components
 */
declare function Routes({ children, location, }: RoutesProps): React.ReactElement | null;
interface AwaitResolveRenderFunction<Resolve = any> {
    (data: Awaited<Resolve>): React.ReactNode;
}
/**
 * @category Types
 */
interface AwaitProps<Resolve> {
    /**
    When using a function, the resolved value is provided as the parameter.
  
    ```tsx [2]
    <Await resolve={reviewsPromise}>
      {(resolvedReviews) => <Reviews items={resolvedReviews} />}
    </Await>
    ```
  
    When using React elements, {@link useAsyncValue} will provide the
    resolved value:
  
    ```tsx [2]
    <Await resolve={reviewsPromise}>
      <Reviews />
    </Await>
  
    function Reviews() {
      const resolvedReviews = useAsyncValue()
      return <div>...</div>
    }
    ```
    */
    children: React.ReactNode | AwaitResolveRenderFunction<Resolve>;
    /**
    The error element renders instead of the children when the promise rejects.
  
    ```tsx
    <Await
      errorElement={<div>Oops</div>}
      resolve={reviewsPromise}
    >
      <Reviews />
    </Await>
    ```
  
    To provide a more contextual error, you can use the {@link useAsyncError} in a
    child component
  
    ```tsx
    <Await
      errorElement={<ReviewsError />}
      resolve={reviewsPromise}
    >
      <Reviews />
    </Await>
  
    function ReviewsError() {
      const error = useAsyncError()
      return <div>Error loading reviews: {error.message}</div>
    }
    ```
  
    If you do not provide an errorElement, the rejected value will bubble up to
    the nearest route-level {@link NonIndexRouteObject#ErrorBoundary | ErrorBoundary} and be accessible
    via {@link useRouteError} hook.
    */
    errorElement?: React.ReactNode;
    /**
    Takes a promise returned from a {@link LoaderFunction | loader} value to be resolved and rendered.
  
    ```jsx
    import { useLoaderData, Await } from "react-router"
  
    export async function loader() {
      let reviews = getReviews() // not awaited
      let book = await getBook()
      return {
        book,
        reviews, // this is a promise
      }
    }
  
    export default function Book() {
      const {
        book,
        reviews, // this is the same promise
      } = useLoaderData()
  
      return (
        <div>
          <h1>{book.title}</h1>
          <p>{book.description}</p>
          <React.Suspense fallback={<ReviewsSkeleton />}>
            <Await
              // and is the promise we pass to Await
              resolve={reviews}
            >
              <Reviews />
            </Await>
          </React.Suspense>
        </div>
      );
    }
    ```
     */
    resolve: Resolve;
}
/**
Used to render promise values with automatic error handling.

```tsx
import { Await, useLoaderData } from "react-router";

export function loader() {
  // not awaited
  const reviews = getReviews()
  // awaited (blocks the transition)
  const book = await fetch("/api/book").then((res) => res.json())
  return { book, reviews }
}

function Book() {
  const { book, reviews } = useLoaderData();
  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <React.Suspense fallback={<ReviewsSkeleton />}>
        <Await
          resolve={reviews}
          errorElement={
            <div>Could not load reviews 😬</div>
          }
          children={(resolvedReviews) => (
            <Reviews items={resolvedReviews} />
          )}
        />
      </React.Suspense>
    </div>
  );
}
```

**Note:** `<Await>` expects to be rendered inside of a `<React.Suspense>`

@category Components

*/
declare function Await<Resolve>({ children, errorElement, resolve, }: AwaitProps<Resolve>): React.JSX.Element;
/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @category Utils
 */
declare function createRoutesFromChildren(children: React.ReactNode, parentPath?: number[]): RouteObject[];
/**
 * Create route objects from JSX elements instead of arrays of objects
 */
declare let createRoutesFromElements: typeof createRoutesFromChildren;
/**
 * Renders the result of `matchRoutes()` into a React element.
 *
 * @category Utils
 */
declare function renderMatches(matches: RouteMatch[] | null): React.ReactElement | null;

type SerializedError = {
    message: string;
    stack?: string;
};
interface FrameworkContextObject {
    manifest: AssetsManifest;
    routeModules: RouteModules;
    criticalCss?: CriticalCss;
    serverHandoffString?: string;
    future: FutureConfig;
    ssr: boolean;
    isSpaMode: boolean;
    serializeError?(error: Error): SerializedError;
    renderMeta?: {
        didRenderScripts?: boolean;
        streamCache?: Record<number, Promise<void> & {
            result?: {
                done: boolean;
                value: string;
            };
            error?: unknown;
        }>;
    };
}
interface EntryContext extends FrameworkContextObject {
    staticHandlerContext: StaticHandlerContext;
    serverHandoffStream?: ReadableStream<Uint8Array>;
}
interface FutureConfig {
    unstable_subResourceIntegrity: boolean;
    unstable_middleware: boolean;
}
type CriticalCss = string | {
    rel: "stylesheet";
    href: string;
};
interface AssetsManifest {
    entry: {
        imports: string[];
        module: string;
    };
    routes: RouteManifest<EntryRoute>;
    url: string;
    version: string;
    hmr?: {
        timestamp?: number;
        runtime: string;
    };
    sri?: Record<string, string> | true;
}

interface Route {
    index?: boolean;
    caseSensitive?: boolean;
    id: string;
    parentId?: string;
    path?: string;
}
interface EntryRoute extends Route {
    hasAction: boolean;
    hasLoader: boolean;
    hasClientAction: boolean;
    hasClientLoader: boolean;
    hasClientMiddleware: boolean;
    hasErrorBoundary: boolean;
    imports?: string[];
    css?: string[];
    module: string;
    clientActionModule: string | undefined;
    clientLoaderModule: string | undefined;
    clientMiddlewareModule: string | undefined;
    hydrateFallbackModule: string | undefined;
    parentId?: string;
}
declare function createClientRoutesWithHMRRevalidationOptOut(needsRevalidation: Set<string>, manifest: RouteManifest<EntryRoute>, routeModulesCache: RouteModules, initialState: HydrationState, ssr: boolean, isSpaMode: boolean): DataRouteObject[];
declare function createClientRoutes(manifest: RouteManifest<EntryRoute>, routeModulesCache: RouteModules, initialState: HydrationState | null, ssr: boolean, isSpaMode: boolean, parentId?: string, routesByParentId?: Record<string, Omit<EntryRoute, "children">[]>, needsRevalidation?: Set<string>): DataRouteObject[];
declare function shouldHydrateRouteLoader(route: EntryRoute, routeModule: RouteModule, isSpaMode: boolean): boolean;

type ParamKeyValuePair = [string, string];
type URLSearchParamsInit = string | ParamKeyValuePair[] | Record<string, string | string[]> | URLSearchParams;
/**
  Creates a URLSearchParams object using the given initializer.

  This is identical to `new URLSearchParams(init)` except it also
  supports arrays as values in the object form of the initializer
  instead of just strings. This is convenient when you need multiple
  values for a given key, but don't want to use an array initializer.

  For example, instead of:

  ```tsx
  let searchParams = new URLSearchParams([
    ['sort', 'name'],
    ['sort', 'price']
  ]);
  ```
  you can do:

  ```
  let searchParams = createSearchParams({
    sort: ['name', 'price']
  });
  ```

  @category Utils
 */
declare function createSearchParams(init?: URLSearchParamsInit): URLSearchParams;
type JsonObject = {
    [Key in string]: JsonValue;
} & {
    [Key in string]?: JsonValue | undefined;
};
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type SubmitTarget = HTMLFormElement | HTMLButtonElement | HTMLInputElement | FormData | URLSearchParams | JsonValue | null;
/**
 * Submit options shared by both navigations and fetchers
 */
interface SharedSubmitOptions {
    /**
     * The HTTP method used to submit the form. Overrides `<form method>`.
     * Defaults to "GET".
     */
    method?: HTMLFormMethod;
    /**
     * The action URL path used to submit the form. Overrides `<form action>`.
     * Defaults to the path of the current route.
     */
    action?: string;
    /**
     * The encoding used to submit the form. Overrides `<form encType>`.
     * Defaults to "application/x-www-form-urlencoded".
     */
    encType?: FormEncType;
    /**
     * Determines whether the form action is relative to the route hierarchy or
     * the pathname.  Use this if you want to opt out of navigating the route
     * hierarchy and want to instead route based on /-delimited URL segments
     */
    relative?: RelativeRoutingType;
    /**
     * In browser-based environments, prevent resetting scroll after this
     * navigation when using the <ScrollRestoration> component
     */
    preventScrollReset?: boolean;
    /**
     * Enable flushSync for this submission's state updates
     */
    flushSync?: boolean;
}
/**
 * Submit options available to fetchers
 */
interface FetcherSubmitOptions extends SharedSubmitOptions {
}
/**
 * Submit options available to navigations
 */
interface SubmitOptions extends FetcherSubmitOptions {
    /**
     * Set `true` to replace the current entry in the browser's history stack
     * instead of creating a new one (i.e. stay on "the same page"). Defaults
     * to `false`.
     */
    replace?: boolean;
    /**
     * State object to add to the history stack entry for this navigation
     */
    state?: any;
    /**
     * Indicate a specific fetcherKey to use when using navigate=false
     */
    fetcherKey?: string;
    /**
     * navigate=false will use a fetcher instead of a navigation
     */
    navigate?: boolean;
    /**
     * Enable view transitions on this submission navigation
     */
    viewTransition?: boolean;
}

declare const FrameworkContext: React.Context<FrameworkContextObject | undefined>;
/**
 * Defines the discovery behavior of the link:
 *
 * - "render" - default, discover the route when the link renders
 * - "none" - don't eagerly discover, only discover if the link is clicked
 */
type DiscoverBehavior = "render" | "none";
/**
 * Defines the prefetching behavior of the link:
 *
 * - "none": Never fetched
 * - "intent": Fetched when the user focuses or hovers the link
 * - "render": Fetched when the link is rendered
 * - "viewport": Fetched when the link is in the viewport
 */
type PrefetchBehavior = "intent" | "render" | "none" | "viewport";
/**
  Renders all of the `<link>` tags created by route module {@link LinksFunction} export. You should render it inside the `<head>` of your document.

  ```tsx
  import { Links } from "react-router";

  export default function Root() {
    return (
      <html>
        <head>
          <Links />
        </head>
        <body></body>
      </html>
    );
  }
  ```

  @category Components
 */
declare function Links(): React.JSX.Element;
/**
  Renders `<link rel=prefetch|modulepreload>` tags for modules and data of another page to enable an instant navigation to that page. {@link LinkProps.prefetch | `<Link prefetch>`} uses this internally, but you can render it to prefetch a page for any other reason.

  ```tsx
  import { PrefetchPageLinks } from "react-router"

  <PrefetchPageLinks page="/absolute/path" />
  ```

  For example, you may render one of this as the user types into a search field to prefetch search results before they click through to their selection.

  @category Components
 */
declare function PrefetchPageLinks({ page, ...dataLinkProps }: PageLinkDescriptor): React.JSX.Element | null;
/**
  Renders all the `<meta>` tags created by route module {@link MetaFunction} exports. You should render it inside the `<head>` of your HTML.

  ```tsx
  import { Meta } from "react-router";

  export default function Root() {
    return (
      <html>
        <head>
          <Meta />
        </head>
      </html>
    );
  }
  ```

  @category Components
 */
declare function Meta(): React.JSX.Element;
/**
  A couple common attributes:

  - `<Scripts crossOrigin>` for hosting your static assets on a different server than your app.
  - `<Scripts nonce>` to support a [content security policy for scripts](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) with [nonce-sources](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#sources) for your `<script>` tags.

  You cannot pass through attributes such as `async`, `defer`, `src`, `type`, `noModule` because they are managed by React Router internally.

  @category Types
 */
type ScriptsProps = Omit<React.HTMLProps<HTMLScriptElement>, "children" | "async" | "defer" | "src" | "type" | "noModule" | "dangerouslySetInnerHTML" | "suppressHydrationWarning">;
/**
  Renders the client runtime of your app. It should be rendered inside the `<body>` of the document.

  ```tsx
  import { Scripts } from "react-router";

  export default function Root() {
    return (
      <html>
        <head />
        <body>
          <Scripts />
        </body>
      </html>
    );
  }
  ```

  If server rendering, you can omit `<Scripts/>` and the app will work as a traditional web app without JavaScript, relying solely on HTML and browser behaviors.

  @category Components
 */
declare function Scripts(props: ScriptsProps): React.JSX.Element | null;

declare global {
    const REACT_ROUTER_VERSION: string;
}
/**
 * @category Routers
 */
interface DOMRouterOpts {
    /**
     * Basename path for the application.
     */
    basename?: string;
    /**
     * Function to provide the initial context values for all client side navigations/fetches
     */
    unstable_getContext?: RouterInit["unstable_getContext"];
    /**
     * Future flags to enable for the router.
     */
    future?: Partial<FutureConfig$1>;
    /**
     * Hydration data to initialize the router with if you have already performed
     * data loading on the server.
     */
    hydrationData?: HydrationState;
    /**
     * Override the default data strategy of loading in parallel.
     * Only intended for advanced usage.
     */
    dataStrategy?: DataStrategyFunction;
    /**
     * Lazily define portions of the route tree on navigations.
     */
    patchRoutesOnNavigation?: PatchRoutesOnNavigationFunction;
    /**
     * Window object override - defaults to the global `window` instance.
     */
    window?: Window;
}
/**
 * Create a new data router that manages the application path via `history.pushState`
 * and `history.replaceState`.
 *
 * @category Data Routers
 */
declare function createBrowserRouter(
/**
 * Application routes
 */
routes: RouteObject[], 
/**
 * Router options
 */
opts?: DOMRouterOpts): Router$1;
/**
 * Create a new data router that manages the application path via the URL hash
 *
 * @category Data Routers
 */
declare function createHashRouter(routes: RouteObject[], opts?: DOMRouterOpts): Router$1;
/**
 * @category Types
 */
interface BrowserRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
}
/**
 * A `<Router>` for use in web browsers. Provides the cleanest URLs.
 *
 * @category Component Routers
 */
declare function BrowserRouter({ basename, children, window, }: BrowserRouterProps): React.JSX.Element;
/**
 * @category Types
 */
interface HashRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
}
/**
 * A `<Router>` for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 *
 * @category Component Routers
 */
declare function HashRouter({ basename, children, window }: HashRouterProps): React.JSX.Element;
/**
 * @category Types
 */
interface HistoryRouterProps {
    basename?: string;
    children?: React.ReactNode;
    history: History;
}
/**
 * A `<Router>` that accepts a pre-instantiated history object. It's important
 * to note that using your own history object is highly discouraged and may add
 * two versions of the history library to your bundles unless you use the same
 * version of the history library that React Router uses internally.
 *
 * @name unstable_HistoryRouter
 * @category Component Routers
 */
declare function HistoryRouter({ basename, children, history, }: HistoryRouterProps): React.JSX.Element;
declare namespace HistoryRouter {
    var displayName: string;
}
/**
 * @category Types
 */
interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    /**
      Defines the link discovery behavior
  
      ```tsx
      <Link /> // default ("render")
      <Link discover="render" />
      <Link discover="none" />
      ```
  
      - **render** - default, discover the route when the link renders
      - **none** - don't eagerly discover, only discover if the link is clicked
    */
    discover?: DiscoverBehavior;
    /**
      Defines the data and module prefetching behavior for the link.
  
      ```tsx
      <Link /> // default
      <Link prefetch="none" />
      <Link prefetch="intent" />
      <Link prefetch="render" />
      <Link prefetch="viewport" />
      ```
  
      - **none** - default, no prefetching
      - **intent** - prefetches when the user hovers or focuses the link
      - **render** - prefetches when the link renders
      - **viewport** - prefetches when the link is in the viewport, very useful for mobile
  
      Prefetching is done with HTML `<link rel="prefetch">` tags. They are inserted after the link.
  
      ```tsx
      <a href="..." />
      <a href="..." />
      <link rel="prefetch" /> // might conditionally render
      ```
  
      Because of this, if you are using `nav :last-child` you will need to use `nav :last-of-type` so the styles don't conditionally fall off your last link (and any other similar selectors).
     */
    prefetch?: PrefetchBehavior;
    /**
      Will use document navigation instead of client side routing when the link is clicked: the browser will handle the transition normally (as if it were an `<a href>`).
  
      ```tsx
      <Link to="/logout" reloadDocument />
      ```
     */
    reloadDocument?: boolean;
    /**
      Replaces the current entry in the history stack instead of pushing a new one onto it.
  
      ```tsx
      <Link replace />
      ```
  
      ```
      # with a history stack like this
      A -> B
  
      # normal link click pushes a new entry
      A -> B -> C
  
      # but with `replace`, B is replaced by C
      A -> C
      ```
     */
    replace?: boolean;
    /**
      Adds persistent client side routing state to the next location.
  
      ```tsx
      <Link to="/somewhere/else" state={{ some: "value" }} />
      ```
  
      The location state is accessed from the `location`.
  
      ```tsx
      function SomeComp() {
        const location = useLocation()
        location.state; // { some: "value" }
      }
      ```
  
      This state is inaccessible on the server as it is implemented on top of [`history.state`](https://developer.mozilla.org/en-US/docs/Web/API/History/state)
     */
    state?: any;
    /**
      Prevents the scroll position from being reset to the top of the window when the link is clicked and the app is using {@link ScrollRestoration}. This only prevents new locations reseting scroll to the top, scroll position will be restored for back/forward button navigation.
  
      ```tsx
      <Link to="?tab=one" preventScrollReset />
      ```
     */
    preventScrollReset?: boolean;
    /**
      Defines the relative path behavior for the link.
  
      ```tsx
      <Link to=".." /> // default: "route"
      <Link relative="route" />
      <Link relative="path" />
      ```
  
      Consider a route hierarchy where a parent route pattern is "blog" and a child route pattern is "blog/:slug/edit".
  
      - **route** - default, resolves the link relative to the route pattern. In the example above a relative link of `".."` will remove both `:slug/edit` segments back to "/blog".
      - **path** - relative to the path so `..` will only remove one URL segment up to "/blog/:slug"
     */
    relative?: RelativeRoutingType;
    /**
      Can be a string or a partial {@link Path}:
  
      ```tsx
      <Link to="/some/path" />
  
      <Link
        to={{
          pathname: "/some/path",
          search: "?query=string",
          hash: "#hash",
        }}
      />
      ```
     */
    to: To;
    /**
      Enables a [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) for this navigation.
  
      ```jsx
      <Link to={to} viewTransition>
        Click me
      </Link>
      ```
  
      To apply specific styles for the transition, see {@link useViewTransitionState}
     */
    viewTransition?: boolean;
}
/**
  A progressively enhanced `<a href>` wrapper to enable navigation with client-side routing.

  ```tsx
  import { Link } from "react-router";

  <Link to="/dashboard">Dashboard</Link>;

  <Link
    to={{
      pathname: "/some/path",
      search: "?query=string",
      hash: "#hash",
    }}
  />
  ```

  @category Components
 */
declare const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
/**
  The object passed to {@link NavLink} `children`, `className`, and `style` prop callbacks to render and style the link based on its state.

  ```
  // className
  <NavLink
    to="/messages"
    className={({ isActive, isPending }) =>
      isPending ? "pending" : isActive ? "active" : ""
    }
  >
    Messages
  </NavLink>

  // style
  <NavLink
    to="/messages"
    style={({ isActive, isPending }) => {
      return {
        fontWeight: isActive ? "bold" : "",
        color: isPending ? "red" : "black",
      }
    )}
  />

  // children
  <NavLink to="/tasks">
    {({ isActive, isPending }) => (
      <span className={isActive ? "active" : ""}>Tasks</span>
    )}
  </NavLink>
  ```

 */
type NavLinkRenderProps = {
    /**
     * Indicates if the link's URL matches the current location.
     */
    isActive: boolean;
    /**
     * Indicates if the pending location matches the link's URL.
     */
    isPending: boolean;
    /**
     * Indicates if a view transition to the link's URL is in progress. See {@link useViewTransitionState}
     */
    isTransitioning: boolean;
};
/**
 * @category Types
 */
interface NavLinkProps extends Omit<LinkProps, "className" | "style" | "children"> {
    /**
      Can be regular React children or a function that receives an object with the active and pending states of the link.
  
      ```tsx
      <NavLink to="/tasks">
        {({ isActive }) => (
          <span className={isActive ? "active" : ""}>Tasks</span>
        )}
      </NavLink>
      ```
     */
    children?: React.ReactNode | ((props: NavLinkRenderProps) => React.ReactNode);
    /**
      Changes the matching logic to make it case-sensitive:
  
      | Link                                         | URL           | isActive |
      | -------------------------------------------- | ------------- | -------- |
      | `<NavLink to="/SpOnGe-bOB" />`               | `/sponge-bob` | true     |
      | `<NavLink to="/SpOnGe-bOB" caseSensitive />` | `/sponge-bob` | false    |
     */
    caseSensitive?: boolean;
    /**
      Classes are automatically applied to NavLink that correspond to {@link NavLinkRenderProps}.
  
      ```css
      a.active { color: red; }
      a.pending { color: blue; }
      a.transitioning {
        view-transition-name: my-transition;
      }
      ```
     */
    className?: string | ((props: NavLinkRenderProps) => string | undefined);
    /**
      Changes the matching logic for the `active` and `pending` states to only match to the "end" of the {@link NavLinkProps.to}. If the URL is longer, it will no longer be considered active.
  
      | Link                          | URL          | isActive |
      | ----------------------------- | ------------ | -------- |
      | `<NavLink to="/tasks" />`     | `/tasks`     | true     |
      | `<NavLink to="/tasks" />`     | `/tasks/123` | true     |
      | `<NavLink to="/tasks" end />` | `/tasks`     | true     |
      | `<NavLink to="/tasks" end />` | `/tasks/123` | false    |
  
      `<NavLink to="/">` is an exceptional case because _every_ URL matches `/`. To avoid this matching every single route by default, it effectively ignores the `end` prop and only matches when you're at the root route.
     */
    end?: boolean;
    style?: React.CSSProperties | ((props: NavLinkRenderProps) => React.CSSProperties | undefined);
}
/**
  Wraps {@link Link | `<Link>`} with additional props for styling active and pending states.

  - Automatically applies classes to the link based on its active and pending states, see {@link NavLinkProps.className}.
  - Automatically applies `aria-current="page"` to the link when the link is active. See [`aria-current`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current) on MDN.

  ```tsx
  import { NavLink } from "react-router"
  <NavLink to="/message" />
  ```

  States are available through the className, style, and children render props. See {@link NavLinkRenderProps}.

  ```tsx
  <NavLink
    to="/messages"
    className={({ isActive, isPending }) =>
      isPending ? "pending" : isActive ? "active" : ""
    }
  >
    Messages
  </NavLink>
  ```

  @category Components
 */
declare const NavLink: React.ForwardRefExoticComponent<NavLinkProps & React.RefAttributes<HTMLAnchorElement>>;
/**
 * Form props shared by navigations and fetchers
 */
interface SharedFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    /**
     * The HTTP verb to use when the form is submitted. Supports "get", "post",
     * "put", "delete", and "patch".
     *
     * Native `<form>` only supports `get` and `post`, avoid the other verbs if
     * you'd like to support progressive enhancement
     */
    method?: HTMLFormMethod;
    /**
     * The encoding type to use for the form submission.
     */
    encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
    /**
     * The URL to submit the form data to.  If `undefined`, this defaults to the closest route in context.
     */
    action?: string;
    /**
     * Determines whether the form action is relative to the route hierarchy or
     * the pathname.  Use this if you want to opt out of navigating the route
     * hierarchy and want to instead route based on /-delimited URL segments
     */
    relative?: RelativeRoutingType;
    /**
     * Prevent the scroll position from resetting to the top of the viewport on
     * completion of the navigation when using the <ScrollRestoration> component
     */
    preventScrollReset?: boolean;
    /**
     * A function to call when the form is submitted. If you call
     * `event.preventDefault()` then this form will not do anything.
     */
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
}
/**
 * Form props available to fetchers
 * @category Types
 */
interface FetcherFormProps extends SharedFormProps {
}
/**
 * Form props available to navigations
 * @category Types
 */
interface FormProps extends SharedFormProps {
    discover?: DiscoverBehavior;
    /**
     * Indicates a specific fetcherKey to use when using `navigate={false}` so you
     * can pick up the fetcher's state in a different component in a {@link
     * useFetcher}.
     */
    fetcherKey?: string;
    /**
     * Skips the navigation and uses a {@link useFetcher | fetcher} internally
     * when `false`. This is essentially a shorthand for `useFetcher()` +
     * `<fetcher.Form>` where you don't care about the resulting data in this
     * component.
     */
    navigate?: boolean;
    /**
     * Forces a full document navigation instead of client side routing + data
     * fetch.
     */
    reloadDocument?: boolean;
    /**
     * Replaces the current entry in the browser history stack when the form
     * navigates. Use this if you don't want the user to be able to click "back"
     * to the page with the form on it.
     */
    replace?: boolean;
    /**
     * State object to add to the history stack entry for this navigation
     */
    state?: any;
    /**
     * Enables a [View
     * Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
     * for this navigation. To apply specific styles during the transition see
     * {@link useViewTransitionState}.
     */
    viewTransition?: boolean;
}
/**

A progressively enhanced HTML [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) that submits data to actions via `fetch`, activating pending states in `useNavigation` which enables advanced user interfaces beyond a basic HTML form. After a form's action completes, all data on the page is automatically revalidated to keep the UI in sync with the data.

Because it uses the HTML form API, server rendered pages are interactive at a basic level before JavaScript loads. Instead of React Router managing the submission, the browser manages the submission as well as the pending states (like the spinning favicon). After JavaScript loads, React Router takes over enabling web application user experiences.

Form is most useful for submissions that should also change the URL or otherwise add an entry to the browser history stack. For forms that shouldn't manipulate the browser history stack, use [`<fetcher.Form>`][fetcher_form].

```tsx
import { Form } from "react-router";

function NewEvent() {
  return (
    <Form action="/events" method="post">
      <input name="title" type="text" />
      <input name="description" type="text" />
    </Form>
  )
}
```

@category Components
*/
declare const Form: React.ForwardRefExoticComponent<FormProps & React.RefAttributes<HTMLFormElement>>;
type ScrollRestorationProps = ScriptsProps & {
    /**
      Defines the key used to restore scroll positions.
  
      ```tsx
      <ScrollRestoration
        getKey={(location, matches) => {
          // default behavior
          return location.key
        }}
      />
      ```
     */
    getKey?: GetScrollRestorationKeyFunction;
    storageKey?: string;
};
/**
  Emulates the browser's scroll restoration on location changes. Apps should only render one of these, right before the {@link Scripts} component.

  ```tsx
  import { ScrollRestoration } from "react-router";

  export default function Root() {
    return (
      <html>
        <body>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
  ```

  This component renders an inline `<script>` to prevent scroll flashing. The `nonce` prop will be passed down to the script tag to allow CSP nonce usage.

  ```tsx
  <ScrollRestoration nonce={cspNonce} />
  ```

  @category Components
 */
declare function ScrollRestoration({ getKey, storageKey, ...props }: ScrollRestorationProps): React.JSX.Element | null;
declare namespace ScrollRestoration {
    var displayName: string;
}
/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` components with the same click behavior we
 * use in our exported `<Link>`.
 *
 * @category Hooks
 */
declare function useLinkClickHandler<E extends Element = HTMLAnchorElement>(to: To, { target, replace: replaceProp, state, preventScrollReset, relative, viewTransition, }?: {
    target?: React.HTMLAttributeAnchorTarget;
    replace?: boolean;
    state?: any;
    preventScrollReset?: boolean;
    relative?: RelativeRoutingType;
    viewTransition?: boolean;
}): (event: React.MouseEvent<E, MouseEvent>) => void;
/**
  Returns a tuple of the current URL's {@link URLSearchParams} and a function to update them. Setting the search params causes a navigation.

  ```tsx
  import { useSearchParams } from "react-router";

  export function SomeComponent() {
    const [searchParams, setSearchParams] = useSearchParams();
    // ...
  }
  ```

 @category Hooks
 */
declare function useSearchParams(defaultInit?: URLSearchParamsInit): [URLSearchParams, SetURLSearchParams];
/**
  Sets new search params and causes a navigation when called.

  ```tsx
  <button
    onClick={() => {
      const params = new URLSearchParams();
      params.set("someKey", "someValue");
      setSearchParams(params, {
        preventScrollReset: true,
      });
    }}
  />
  ```

  It also supports a function for setting new search params.

  ```tsx
  <button
    onClick={() => {
      setSearchParams((prev) => {
        prev.set("someKey", "someValue");
        return prev;
      });
    }}
  />
  ```
 */
type SetURLSearchParams = (nextInit?: URLSearchParamsInit | ((prev: URLSearchParams) => URLSearchParamsInit), navigateOpts?: NavigateOptions) => void;
/**
 * Submits a HTML `<form>` to the server without reloading the page.
 */
interface SubmitFunction {
    (
    /**
      Can be multiple types of elements and objects

      **`HTMLFormElement`**

      ```tsx
      <Form
        onSubmit={(event) => {
          submit(event.currentTarget);
        }}
      />
      ```

      **`FormData`**

      ```tsx
      const formData = new FormData();
      formData.append("myKey", "myValue");
      submit(formData, { method: "post" });
      ```

      **Plain object that will be serialized as `FormData`**

      ```tsx
      submit({ myKey: "myValue" }, { method: "post" });
      ```

      **Plain object that will be serialized as JSON**

      ```tsx
      submit(
        { myKey: "myValue" },
        { method: "post", encType: "application/json" }
      );
      ```
     */
    target: SubmitTarget, 
    /**
     * Options that override the `<form>`'s own attributes. Required when
     * submitting arbitrary data without a backing `<form>`.
     */
    options?: SubmitOptions): Promise<void>;
}
/**
 * Submits a fetcher `<form>` to the server without reloading the page.
 */
interface FetcherSubmitFunction {
    (
    /**
      Can be multiple types of elements and objects

      **`HTMLFormElement`**

      ```tsx
      <fetcher.Form
        onSubmit={(event) => {
          fetcher.submit(event.currentTarget);
        }}
      />
      ```

      **`FormData`**

      ```tsx
      const formData = new FormData();
      formData.append("myKey", "myValue");
      fetcher.submit(formData, { method: "post" });
      ```

      **Plain object that will be serialized as `FormData`**

      ```tsx
      fetcher.submit({ myKey: "myValue" }, { method: "post" });
      ```

      **Plain object that will be serialized as JSON**

      ```tsx
      fetcher.submit(
        { myKey: "myValue" },
        { method: "post", encType: "application/json" }
      );
      ```

     */
    target: SubmitTarget, options?: FetcherSubmitOptions): Promise<void>;
}
/**
  The imperative version of {@link Form | `<Form>`} that lets you submit a form from code instead of a user interaction.

  ```tsx
  import { useSubmit } from "react-router";

  function SomeComponent() {
    const submit = useSubmit();
    return (
      <Form
        onChange={(event) => {
          submit(event.currentTarget);
        }}
      />
    );
  }
  ```

  @category Hooks
 */
declare function useSubmit(): SubmitFunction;
/**
  Resolves the URL to the closest route in the component hierarchy instead of the current URL of the app.

  This is used internally by {@link Form} resolve the action to the closest route, but can be used generically as well.

  ```tsx
  import { useFormAction } from "react-router";

  function SomeComponent() {
    // closest route URL
    let action = useFormAction();

    // closest route URL + "destroy"
    let destroyAction = useFormAction("destroy");
  }
  ```

  @category Hooks
 */
declare function useFormAction(
/**
 * The action to append to the closest route URL.
 */
action?: string, { relative }?: {
    relative?: RelativeRoutingType;
}): string;
/**
The return value of `useFetcher` that keeps track of the state of a fetcher.

```tsx
let fetcher = useFetcher();
```
 */
type FetcherWithComponents<TData> = Fetcher<TData> & {
    /**
      Just like {@link Form} except it doesn't cause a navigation.
  
      ```tsx
      function SomeComponent() {
        const fetcher = useFetcher()
        return (
          <fetcher.Form method="post" action="/some/route">
            <input type="text" />
          </fetcher.Form>
        )
      }
      ```
     */
    Form: React.ForwardRefExoticComponent<FetcherFormProps & React.RefAttributes<HTMLFormElement>>;
    /**
      Submits form data to a route. While multiple nested routes can match a URL, only the leaf route will be called.
  
      The `formData` can be multiple types:
  
      - [`FormData`][form_data] - A `FormData` instance.
      - [`HTMLFormElement`][html_form_element] - A [`<form>`][form_element] DOM element.
      - `Object` - An object of key/value pairs that will be converted to a `FormData` instance by default. You can pass a more complex object and serialize it as JSON by specifying `encType: "application/json"`. See [`useSubmit`][use-submit] for more details.
  
      If the method is `GET`, then the route [`loader`][loader] is being called and with the `formData` serialized to the url as [`URLSearchParams`][url_search_params]. If `DELETE`, `PATCH`, `POST`, or `PUT`, then the route [`action`][action] is being called with `formData` as the body.
  
      ```tsx
      // Submit a FormData instance (GET request)
      const formData = new FormData();
      fetcher.submit(formData);
  
      // Submit the HTML form element
      fetcher.submit(event.currentTarget.form, {
        method: "POST",
      });
  
      // Submit key/value JSON as a FormData instance
      fetcher.submit(
        { serialized: "values" },
        { method: "POST" }
      );
  
      // Submit raw JSON
      fetcher.submit(
        {
          deeply: {
            nested: {
              json: "values",
            },
          },
        },
        {
          method: "POST",
          encType: "application/json",
        }
      );
      ```
     */
    submit: FetcherSubmitFunction;
    /**
      Loads data from a route. Useful for loading data imperatively inside of user events outside of a normal button or form, like a combobox or search input.
  
      ```tsx
      let fetcher = useFetcher()
  
      <input onChange={e => {
        fetcher.load(`/search?q=${e.target.value}`)
      }} />
      ```
     */
    load: (href: string, opts?: {
        /**
         * Wraps the initial state update for this `fetcher.load` in a
         * `ReactDOM.flushSync` call instead of the default `React.startTransition`.
         * This allows you to perform synchronous DOM actions immediately after the
         * update is flushed to the DOM.
         */
        flushSync?: boolean;
    }) => Promise<void>;
};
/**
  Useful for creating complex, dynamic user interfaces that require multiple, concurrent data interactions without causing a navigation.

  Fetchers track their own, independent state and can be used to load data, submit forms, and generally interact with loaders and actions.

  ```tsx
  import { useFetcher } from "react-router"

  function SomeComponent() {
    let fetcher = useFetcher()

    // states are available on the fetcher
    fetcher.state // "idle" | "loading" | "submitting"
    fetcher.data // the data returned from the action or loader

    // render a form
    <fetcher.Form method="post" />

    // load data
    fetcher.load("/some/route")

    // submit data
    fetcher.submit(someFormRef, { method: "post" })
    fetcher.submit(someData, {
      method: "post",
      encType: "application/json"
    })
  }
  ```

  @category Hooks
 */
declare function useFetcher<T = any>({ key, }?: {
    /**
      By default, `useFetcher` generate a unique fetcher scoped to that component. If you want to identify a fetcher with your own key such that you can access it from elsewhere in your app, you can do that with the `key` option:
  
      ```tsx
      function SomeComp() {
        let fetcher = useFetcher({ key: "my-key" })
        // ...
      }
  
      // Somewhere else
      function AnotherComp() {
        // this will be the same fetcher, sharing the state across the app
        let fetcher = useFetcher({ key: "my-key" });
        // ...
      }
      ```
     */
    key?: string;
}): FetcherWithComponents<SerializeFrom<T>>;
/**
  Returns an array of all in-flight fetchers. This is useful for components throughout the app that didn't create the fetchers but want to use their submissions to participate in optimistic UI.

  ```tsx
  import { useFetchers } from "react-router";

  function SomeComponent() {
    const fetchers = useFetchers();
    fetchers[0].formData; // FormData
    fetchers[0].state; // etc.
    // ...
  }
  ```

  @category Hooks
 */
declare function useFetchers(): (Fetcher & {
    key: string;
})[];
/**
 * When rendered inside a RouterProvider, will restore scroll positions on navigations
 */
declare function useScrollRestoration({ getKey, storageKey, }?: {
    getKey?: GetScrollRestorationKeyFunction;
    storageKey?: string;
}): void;
/**
 * Setup a callback to be fired on the window's `beforeunload` event.
 *
 * @category Hooks
 */
declare function useBeforeUnload(callback: (event: BeforeUnloadEvent) => any, options?: {
    capture?: boolean;
}): void;
/**
  Wrapper around useBlocker to show a window.confirm prompt to users instead of building a custom UI with {@link useBlocker}.

  The `unstable_` flag will not be removed because this technique has a lot of rough edges and behaves very differently (and incorrectly sometimes) across browsers if users click addition back/forward navigations while the confirmation is open.  Use at your own risk.

  ```tsx
  function ImportantForm() {
    let [value, setValue] = React.useState("");

    // Block navigating elsewhere when data has been entered into the input
    unstable_usePrompt({
      message: "Are you sure?",
      when: ({ currentLocation, nextLocation }) =>
        value !== "" &&
        currentLocation.pathname !== nextLocation.pathname,
    });

    return (
      <Form method="post">
        <label>
          Enter some important data:
          <input
            name="data"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
        <button type="submit">Save</button>
      </Form>
    );
  }
  ```

  @category Hooks
  @name unstable_usePrompt
 */
declare function usePrompt({ when, message, }: {
    when: boolean | BlockerFunction;
    message: string;
}): void;
/**
  This hook returns `true` when there is an active [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) to the specified location. This can be used to apply finer-grained styles to elements to further customize the view transition. This requires that view transitions have been enabled for the given navigation via {@link LinkProps.viewTransition} (or the `Form`, `submit`, or `navigate` call)

  @category Hooks
  @name useViewTransitionState
 */
declare function useViewTransitionState(to: To, opts?: {
    relative?: RelativeRoutingType;
}): boolean;

declare global {
    interface Navigator {
        connection?: {
            saveData: boolean;
        };
    }
}
declare function getPatchRoutesOnNavigationFunction(manifest: AssetsManifest, routeModules: RouteModules, ssr: boolean, isSpaMode: boolean, basename: string | undefined): PatchRoutesOnNavigationFunction | undefined;
declare function useFogOFWarDiscovery(router: Router$1, manifest: AssetsManifest, routeModules: RouteModules, ssr: boolean, isSpaMode: boolean): void;

export { useSearchParams as $, type AssetsManifest as A, type BrowserRouterProps as B, type CriticalCss as C, type DOMRouterOpts as D, type EntryContext as E, type FutureConfig as F, type FetcherSubmitFunction as G, type HashRouterProps as H, type IndexRouteProps as I, type FetcherWithComponents as J, createBrowserRouter as K, type LayoutRouteProps as L, type MemoryRouterOpts as M, type NavigateProps as N, type OutletProps as O, type PathRouteProps as P, createHashRouter as Q, type RouterProviderProps as R, type ScrollRestorationProps as S, BrowserRouter as T, HashRouter as U, Link as V, HistoryRouter as W, NavLink as X, Form as Y, ScrollRestoration as Z, useLinkClickHandler as _, type Route as a, useSubmit as a0, useFormAction as a1, useFetcher as a2, useFetchers as a3, useBeforeUnload as a4, usePrompt as a5, useViewTransitionState as a6, type FetcherSubmitOptions as a7, type ParamKeyValuePair as a8, type SubmitOptions as a9, type URLSearchParamsInit as aa, type SubmitTarget as ab, createSearchParams as ac, Meta as ad, Links as ae, Scripts as af, PrefetchPageLinks as ag, type ScriptsProps as ah, mapRouteProperties as ai, FrameworkContext as aj, getPatchRoutesOnNavigationFunction as ak, useFogOFWarDiscovery as al, createClientRoutes as am, createClientRoutesWithHMRRevalidationOptOut as an, shouldHydrateRouteLoader as ao, useScrollRestoration as ap, type AwaitProps as b, type MemoryRouterProps as c, type RouteProps as d, type RouterProps as e, type RoutesProps as f, Await as g, MemoryRouter as h, Navigate as i, Outlet as j, Route$1 as k, Router as l, RouterProvider as m, Routes as n, createMemoryRouter as o, createRoutesFromChildren as p, createRoutesFromElements as q, renderMatches as r, type HistoryRouterProps as s, type LinkProps as t, type NavLinkProps as u, type NavLinkRenderProps as v, type FetcherFormProps as w, type FormProps as x, type SetURLSearchParams as y, type SubmitFunction as z };
