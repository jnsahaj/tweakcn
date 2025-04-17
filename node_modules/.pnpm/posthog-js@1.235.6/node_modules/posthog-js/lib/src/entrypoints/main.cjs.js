import './external-scripts-loader';
import { init_as_module } from '../posthog-core';
export { PostHog } from '../posthog-core';
export * from '../types';
export * from '../posthog-surveys-types';
export var posthog = init_as_module();
export default posthog;
//# sourceMappingURL=main.cjs.js.map