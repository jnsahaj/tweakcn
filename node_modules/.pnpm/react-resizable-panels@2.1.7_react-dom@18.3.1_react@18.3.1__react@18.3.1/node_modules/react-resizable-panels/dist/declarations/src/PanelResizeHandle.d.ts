import { PointerHitAreaMargins } from "./PanelResizeHandleRegistry.js";
import { CSSProperties, HTMLAttributes, PropsWithChildren, ReactElement } from "./vendor/react.js";
export type PanelResizeHandleOnDragging = (isDragging: boolean) => void;
export type ResizeHandlerState = "drag" | "hover" | "inactive";
export type PanelResizeHandleProps = Omit<HTMLAttributes<keyof HTMLElementTagNameMap>, "id" | "onBlur" | "onFocus"> & PropsWithChildren<{
    className?: string;
    disabled?: boolean;
    hitAreaMargins?: PointerHitAreaMargins;
    id?: string | null;
    onBlur?: () => void;
    onDragging?: PanelResizeHandleOnDragging;
    onFocus?: () => void;
    style?: CSSProperties;
    tabIndex?: number;
    tagName?: keyof HTMLElementTagNameMap;
}>;
export declare function PanelResizeHandle({ children, className: classNameFromProps, disabled, hitAreaMargins, id: idFromProps, onBlur, onDragging, onFocus, style: styleFromProps, tabIndex, tagName: Type, ...rest }: PanelResizeHandleProps): ReactElement;
export declare namespace PanelResizeHandle {
    var displayName: string;
}
