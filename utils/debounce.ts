export function debounce(fn: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // @ts-expect-error: it works
      fn.apply(this, args);
    }, delay);
  };
}
