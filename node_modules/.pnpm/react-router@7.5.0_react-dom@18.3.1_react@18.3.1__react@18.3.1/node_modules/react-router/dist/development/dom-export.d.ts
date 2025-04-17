import * as React from 'react';
import { R as RouterProviderProps$1 } from './fog-of-war-oa9CGk10.js';
import { R as RouterInit } from './route-data-5OzAzQtT.js';

type RouterProviderProps = Omit<RouterProviderProps$1, "flushSync">;
declare function RouterProvider(props: Omit<RouterProviderProps, "flushSync">): React.JSX.Element;

interface HydratedRouterProps {
    /**
     * Context object to passed through to `createBrowserRouter` and made available
     * to `clientLoader`/`clientActon` functions
     */
    unstable_getContext?: RouterInit["unstable_getContext"];
}
/**
 * Framework-mode router component to be used in `entry.client.tsx` to hydrate a
 * router from a `ServerRouter`
 *
 * @category Component Routers
 */
declare function HydratedRouter(props: HydratedRouterProps): React.JSX.Element;

export { HydratedRouter, RouterProvider, type RouterProviderProps };
