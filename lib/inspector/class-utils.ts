export const getClassString = (el: Element): string => {
  const cnProp = (el as HTMLElement | SVGElement).className;
  if (typeof cnProp === "string") return cnProp;
  if (cnProp && typeof cnProp === "object" && "baseVal" in cnProp) {
    return (cnProp as SVGAnimatedString).baseVal;
  }
  return "";
};
