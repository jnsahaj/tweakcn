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

// src/streamedQuery.ts
var streamedQuery_exports = {};
__export(streamedQuery_exports, {
  streamedQuery: () => streamedQuery
});
module.exports = __toCommonJS(streamedQuery_exports);
function streamedQuery({
  queryFn,
  refetchMode
}) {
  return async (context) => {
    if (refetchMode !== "append") {
      const query = context.client.getQueryCache().find({ queryKey: context.queryKey, exact: true });
      if (query && query.state.data !== void 0) {
        query.setState({
          status: "pending",
          data: void 0,
          error: null,
          fetchStatus: "fetching"
        });
      }
    }
    const stream = await queryFn(context);
    for await (const chunk of stream) {
      if (context.signal.aborted) {
        break;
      }
      context.client.setQueryData(
        context.queryKey,
        (prev = []) => {
          return prev.concat(chunk);
        }
      );
    }
    return context.client.getQueryData(context.queryKey);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  streamedQuery
});
//# sourceMappingURL=streamedQuery.cjs.map