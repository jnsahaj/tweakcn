// src/streamedQuery.ts
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
export {
  streamedQuery
};
//# sourceMappingURL=streamedQuery.js.map