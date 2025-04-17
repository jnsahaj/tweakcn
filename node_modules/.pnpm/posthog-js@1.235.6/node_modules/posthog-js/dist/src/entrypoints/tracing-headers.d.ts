import { SessionIdManager } from '../sessionid';
declare const patchFns: {
    _patchFetch: (sessionManager?: SessionIdManager) => (() => void);
    _patchXHR: (sessionManager?: SessionIdManager) => (() => void);
};
export default patchFns;
