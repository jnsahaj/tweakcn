import { type RouteConfig, route } from "@react-router/dev/routes";

export default [route("*?", "catchall.tsx")] satisfies RouteConfig;
