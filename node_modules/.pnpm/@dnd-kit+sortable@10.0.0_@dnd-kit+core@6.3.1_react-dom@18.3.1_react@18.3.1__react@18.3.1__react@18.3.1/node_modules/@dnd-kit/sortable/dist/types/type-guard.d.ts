import type { Active, Data, DroppableContainer, DraggableNode, Over } from '@dnd-kit/core';
import type { SortableData } from './data';
export declare function hasSortableData<T extends Active | Over | DraggableNode | DroppableContainer>(entry: T | null | undefined): entry is T & {
    data: {
        current: Data<SortableData>;
    };
};
