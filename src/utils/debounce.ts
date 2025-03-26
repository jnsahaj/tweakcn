export function debounce(fn: (...args: any[]) => void, delay: number) {
  let timeoutId;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
