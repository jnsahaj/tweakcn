import type { UniqueIdentifier } from '@dnd-kit/core';
export declare type SortableData = {
    sortable: {
        containerId: UniqueIdentifier;
        items: UniqueIdentifier[];
        index: number;
    };
};
