export interface InspectorState {
  rect: DOMRect | null;
  className: string;
}

export const areRectsEqual = (rect1: DOMRect | null, rect2: DOMRect | null): boolean => {
  if (!rect1 || !rect2) return rect1 === rect2;

  return (
    rect1.top === rect2.top &&
    rect1.left === rect2.left &&
    rect1.width === rect2.width &&
    rect1.height === rect2.height
  );
};

export const areInspectorStatesEqual = (
  state1: InspectorState,
  state2: InspectorState
): boolean => {
  return areRectsEqual(state1.rect, state2.rect) && state1.className === state2.className;
};

export const createInspectorState = (rect: DOMRect, matches: string[]): InspectorState => ({
  rect,
  className: matches.join(" "),
});

export const getEmptyInspectorState = (): InspectorState => ({
  rect: null,
  className: "",
});
