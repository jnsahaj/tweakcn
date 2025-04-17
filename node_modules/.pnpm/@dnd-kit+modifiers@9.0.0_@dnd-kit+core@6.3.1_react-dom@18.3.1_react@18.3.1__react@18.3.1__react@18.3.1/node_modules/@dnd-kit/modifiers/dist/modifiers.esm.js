import { getEventCoordinates } from '@dnd-kit/utilities';

function createSnapModifier(gridSize) {
  return _ref => {
    let {
      transform
    } = _ref;
    return { ...transform,
      x: Math.ceil(transform.x / gridSize) * gridSize,
      y: Math.ceil(transform.y / gridSize) * gridSize
    };
  };
}

const restrictToHorizontalAxis = _ref => {
  let {
    transform
  } = _ref;
  return { ...transform,
    y: 0
  };
};

function restrictToBoundingRect(transform, rect, boundingRect) {
  const value = { ...transform
  };

  if (rect.top + transform.y <= boundingRect.top) {
    value.y = boundingRect.top - rect.top;
  } else if (rect.bottom + transform.y >= boundingRect.top + boundingRect.height) {
    value.y = boundingRect.top + boundingRect.height - rect.bottom;
  }

  if (rect.left + transform.x <= boundingRect.left) {
    value.x = boundingRect.left - rect.left;
  } else if (rect.right + transform.x >= boundingRect.left + boundingRect.width) {
    value.x = boundingRect.left + boundingRect.width - rect.right;
  }

  return value;
}

const restrictToParentElement = _ref => {
  let {
    containerNodeRect,
    draggingNodeRect,
    transform
  } = _ref;

  if (!draggingNodeRect || !containerNodeRect) {
    return transform;
  }

  return restrictToBoundingRect(transform, draggingNodeRect, containerNodeRect);
};

const restrictToFirstScrollableAncestor = _ref => {
  let {
    draggingNodeRect,
    transform,
    scrollableAncestorRects
  } = _ref;
  const firstScrollableAncestorRect = scrollableAncestorRects[0];

  if (!draggingNodeRect || !firstScrollableAncestorRect) {
    return transform;
  }

  return restrictToBoundingRect(transform, draggingNodeRect, firstScrollableAncestorRect);
};

const restrictToVerticalAxis = _ref => {
  let {
    transform
  } = _ref;
  return { ...transform,
    x: 0
  };
};

const restrictToWindowEdges = _ref => {
  let {
    transform,
    draggingNodeRect,
    windowRect
  } = _ref;

  if (!draggingNodeRect || !windowRect) {
    return transform;
  }

  return restrictToBoundingRect(transform, draggingNodeRect, windowRect);
};

const snapCenterToCursor = _ref => {
  let {
    activatorEvent,
    draggingNodeRect,
    transform
  } = _ref;

  if (draggingNodeRect && activatorEvent) {
    const activatorCoordinates = getEventCoordinates(activatorEvent);

    if (!activatorCoordinates) {
      return transform;
    }

    const offsetX = activatorCoordinates.x - draggingNodeRect.left;
    const offsetY = activatorCoordinates.y - draggingNodeRect.top;
    return { ...transform,
      x: transform.x + offsetX - draggingNodeRect.width / 2,
      y: transform.y + offsetY - draggingNodeRect.height / 2
    };
  }

  return transform;
};

export { createSnapModifier, restrictToFirstScrollableAncestor, restrictToHorizontalAxis, restrictToParentElement, restrictToVerticalAxis, restrictToWindowEdges, snapCenterToCursor };
//# sourceMappingURL=modifiers.esm.js.map
