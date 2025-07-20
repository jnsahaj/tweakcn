export const segmentClassName = (className: string) => {
  // Handle complex selectors with pseudo-classes, data attributes, etc.
  // Look for patterns like "focus-visible:", "hover:", "data-[state=open]:", etc.
  const selectorMatch = className.match(/^((?:[^:]+:)*)/);
  let selector = "";
  let remaining = className;

  if (selectorMatch && selectorMatch[1]) {
    selector = selectorMatch[1].slice(0, -1); // Remove trailing colon
    remaining = className.slice(selectorMatch[1].length);
  }

  // Handle opacity modifier (e.g., "card/80")
  const opacityMatch = remaining.match(/^([^/]+)\/(.+)$/);
  let baseClass = remaining;
  let opacity = "";

  if (opacityMatch) {
    baseClass = opacityMatch[1];
    opacity = opacityMatch[2];
  }

  // Split the base class into prefix and value
  const dashIndex = baseClass.indexOf("-");
  let prefix = "";
  let value = "";

  if (dashIndex !== -1) {
    prefix = baseClass.slice(0, dashIndex);
    value = baseClass.slice(dashIndex + 1);
  } else {
    // No dash found, treat entire string as prefix
    prefix = baseClass;
  }

  return {
    selector: selector || null,
    prefix: prefix || null,
    value: value || null,
    opacity: opacity || null,
  };
};
