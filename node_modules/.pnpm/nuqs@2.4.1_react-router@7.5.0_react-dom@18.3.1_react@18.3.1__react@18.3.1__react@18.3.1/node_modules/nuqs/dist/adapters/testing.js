'use client';

import { resetQueue } from '../chunk-6YKAEXDW.js';
import { context, renderQueryString } from '../chunk-5WWTJYGR.js';
import { createElement } from 'react';

function NuqsTestingAdapter({
  resetUrlUpdateQueueOnMount = true,
  ...props
}) {
  if (resetUrlUpdateQueueOnMount) {
    resetQueue();
  }
  const useAdapter = () => ({
    searchParams: new URLSearchParams(props.searchParams),
    updateUrl(search, options) {
      props.onUrlUpdate?.({
        searchParams: search,
        queryString: renderQueryString(search),
        options
      });
    },
    getSearchParamsSnapshot() {
      return new URLSearchParams(props.searchParams);
    },
    rateLimitFactor: props.rateLimitFactor ?? 0
  });
  return createElement(
    context.Provider,
    { value: { useAdapter } },
    props.children
  );
}
function withNuqsTestingAdapter(props = {}) {
  return function NuqsTestingAdapterWrapper({
    children
  }) {
    return createElement(
      NuqsTestingAdapter,
      // @ts-expect-error - Ignore missing children error
      props,
      children
    );
  };
}

export { NuqsTestingAdapter, withNuqsTestingAdapter };
