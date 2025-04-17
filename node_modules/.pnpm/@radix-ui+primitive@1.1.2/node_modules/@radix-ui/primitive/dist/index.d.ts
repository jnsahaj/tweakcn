declare function composeEventHandlers<E extends {
    defaultPrevented: boolean;
}>(originalEventHandler?: (event: E) => void, ourEventHandler?: (event: E) => void, { checkForDefaultPrevented }?: {
    checkForDefaultPrevented?: boolean | undefined;
}): (event: E) => void;

export { composeEventHandlers };
