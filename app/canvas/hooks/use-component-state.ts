import { useState, useCallback } from "react";
import type { CanvasComponent, ComponentProps } from "../types/canvas-types";
import { GRID_SIZE } from "../utils/grid-utils";

export function useComponentState() {
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([]);

  const addComponent = useCallback(
    (component: CanvasComponent) => {
      const maxZIndex = Math.max(...components.map((c) => c.zIndex), 0);
      const componentWithZIndex = { ...component, zIndex: maxZIndex + 1 };

      setComponents((prev) => [...prev, componentWithZIndex]);
      setSelectedComponentIds([component.id]);
    },
    [components]
  );

  const updateComponent = useCallback((componentId: string, updates: Partial<CanvasComponent>) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === componentId ? { ...comp, ...updates } : comp))
    );
  }, []);

  const updateComponentProps = useCallback((componentId: string, newProps: ComponentProps) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === componentId ? { ...comp, props: { ...comp.props, ...newProps } } : comp
      )
    );
  }, []);

  const deleteComponent = useCallback((componentId: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== componentId));
    setSelectedComponentIds((prev) => prev.filter((id) => id !== componentId));
  }, []);

  const duplicateComponent = useCallback(
    (componentId: string) => {
      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      const newId = `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const offset = GRID_SIZE * 2;
      const maxZIndex = Math.max(...components.map((c) => c.zIndex), 0);

      const copiedComponent: CanvasComponent = {
        ...component,
        id: newId,
        x: component.x + offset,
        y: component.y + offset,
        zIndex: maxZIndex + 1,
        props: component.props ? JSON.parse(JSON.stringify(component.props)) : undefined,
      };

      setComponents((prev) => [...prev, copiedComponent]);
      setSelectedComponentIds([newId]);
    },
    [components]
  );

  const bringToFront = useCallback(
    (componentId: string) => {
      const maxZIndex = Math.max(...components.map((c) => c.zIndex));
      updateComponent(componentId, { zIndex: maxZIndex + 1 });
    },
    [components, updateComponent]
  );

  const sendToBack = useCallback(
    (componentId: string) => {
      const sortedComponents = components
        .filter((c) => c.id !== componentId)
        .sort((a, b) => a.zIndex - b.zIndex);

      updateComponent(componentId, { zIndex: 0 });

      sortedComponents.forEach((comp, index) => {
        updateComponent(comp.id, { zIndex: index + 1 });
      });
    },
    [components, updateComponent]
  );

  const bringForward = useCallback(
    (componentId: string) => {
      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      const componentsAbove = components
        .filter((c) => c.zIndex > component.zIndex)
        .sort((a, b) => a.zIndex - b.zIndex);

      if (componentsAbove.length === 0) return;

      const nextComponent = componentsAbove[0];
      updateComponent(componentId, { zIndex: nextComponent.zIndex });
      updateComponent(nextComponent.id, { zIndex: component.zIndex });
    },
    [components, updateComponent]
  );

  const sendBackward = useCallback(
    (componentId: string) => {
      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      const componentsBelow = components
        .filter((c) => c.zIndex < component.zIndex)
        .sort((a, b) => b.zIndex - a.zIndex);

      if (componentsBelow.length === 0) return;

      const nextComponent = componentsBelow[0];
      updateComponent(componentId, { zIndex: nextComponent.zIndex });
      updateComponent(nextComponent.id, { zIndex: component.zIndex });
    },
    [components, updateComponent]
  );

  const getSelectedComponents = useCallback(() => {
    return components.filter((c) => selectedComponentIds.includes(c.id));
  }, [components, selectedComponentIds]);

  const selectComponent = useCallback((componentId: string) => {
    setSelectedComponentIds([componentId]);
  }, []);

  const selectMultipleComponents = useCallback((componentIds: string[]) => {
    setSelectedComponentIds(componentIds);
  }, []);

  const toggleComponentSelection = useCallback((componentId: string) => {
    setSelectedComponentIds((prev) =>
      prev.includes(componentId) ? prev.filter((id) => id !== componentId) : [...prev, componentId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedComponentIds([]);
  }, []);

  return {
    components,
    selectedComponentIds,
    selectedComponents: getSelectedComponents(),
    setComponents,
    addComponent,
    updateComponent,
    updateComponentProps,
    deleteComponent,
    duplicateComponent,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    selectComponent,
    selectMultipleComponents,
    toggleComponentSelection,
    clearSelection,
  };
}
