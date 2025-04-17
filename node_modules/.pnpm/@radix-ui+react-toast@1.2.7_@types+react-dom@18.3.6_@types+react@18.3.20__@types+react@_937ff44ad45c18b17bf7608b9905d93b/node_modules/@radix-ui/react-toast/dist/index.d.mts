import * as _radix_ui_react_context from '@radix-ui/react-context';
import * as React from 'react';
import * as DismissableLayer from '@radix-ui/react-dismissable-layer';
import { Primitive } from '@radix-ui/react-primitive';

type SwipeDirection = 'up' | 'down' | 'left' | 'right';
declare const createToastScope: _radix_ui_react_context.CreateScope;
interface ToastProviderProps {
    children?: React.ReactNode;
    /**
     * An author-localized label for each toast. Used to help screen reader users
     * associate the interruption with a toast.
     * @defaultValue 'Notification'
     */
    label?: string;
    /**
     * Time in milliseconds that each toast should remain visible for.
     * @defaultValue 5000
     */
    duration?: number;
    /**
     * Direction of pointer swipe that should close the toast.
     * @defaultValue 'right'
     */
    swipeDirection?: SwipeDirection;
    /**
     * Distance in pixels that the swipe must pass before a close is triggered.
     * @defaultValue 50
     */
    swipeThreshold?: number;
}
declare const ToastProvider: React.FC<ToastProviderProps>;
type PrimitiveOrderedListProps = React.ComponentPropsWithoutRef<typeof Primitive.ol>;
interface ToastViewportProps extends PrimitiveOrderedListProps {
    /**
     * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
     * @defaultValue ['F8']
     */
    hotkey?: string[];
    /**
     * An author-localized label for the toast viewport to provide context for screen reader users
     * when navigating page landmarks. The available `{hotkey}` placeholder will be replaced for you.
     * @defaultValue 'Notifications ({hotkey})'
     */
    label?: string;
}
declare const ToastViewport: React.ForwardRefExoticComponent<ToastViewportProps & React.RefAttributes<HTMLOListElement>>;
type ToastElement = ToastImplElement;
interface ToastProps extends Omit<ToastImplProps, keyof ToastImplPrivateProps> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const Toast: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLLIElement>>;
type SwipeEvent = {
    currentTarget: EventTarget & ToastElement;
} & Omit<CustomEvent<{
    originalEvent: React.PointerEvent;
    delta: {
        x: number;
        y: number;
    };
}>, 'currentTarget'>;
type ToastImplElement = React.ElementRef<typeof Primitive.li>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer.Root>;
type ToastImplPrivateProps = {
    open: boolean;
    onClose(): void;
};
type PrimitiveListItemProps = React.ComponentPropsWithoutRef<typeof Primitive.li>;
interface ToastImplProps extends ToastImplPrivateProps, PrimitiveListItemProps {
    type?: 'foreground' | 'background';
    /**
     * Time in milliseconds that toast should remain visible for. Overrides value
     * given to `ToastProvider`.
     */
    duration?: number;
    onEscapeKeyDown?: DismissableLayerProps['onEscapeKeyDown'];
    onPause?(): void;
    onResume?(): void;
    onSwipeStart?(event: SwipeEvent): void;
    onSwipeMove?(event: SwipeEvent): void;
    onSwipeCancel?(event: SwipeEvent): void;
    onSwipeEnd?(event: SwipeEvent): void;
}
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ToastTitleProps extends PrimitiveDivProps {
}
declare const ToastTitle: React.ForwardRefExoticComponent<ToastTitleProps & React.RefAttributes<HTMLDivElement>>;
interface ToastDescriptionProps extends PrimitiveDivProps {
}
declare const ToastDescription: React.ForwardRefExoticComponent<ToastDescriptionProps & React.RefAttributes<HTMLDivElement>>;
interface ToastActionProps extends ToastCloseProps {
    /**
     * A short description for an alternate way to carry out the action. For screen reader users
     * who will not be able to navigate to the button easily/quickly.
     * @example <ToastAction altText="Goto account settings to upgrade">Upgrade</ToastAction>
     * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
     */
    altText: string;
}
declare const ToastAction: React.ForwardRefExoticComponent<ToastActionProps & React.RefAttributes<HTMLButtonElement>>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ToastCloseProps extends PrimitiveButtonProps {
}
declare const ToastClose: React.ForwardRefExoticComponent<ToastCloseProps & React.RefAttributes<HTMLButtonElement>>;
declare const Provider: React.FC<ToastProviderProps>;
declare const Viewport: React.ForwardRefExoticComponent<ToastViewportProps & React.RefAttributes<HTMLOListElement>>;
declare const Root: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLLIElement>>;
declare const Title: React.ForwardRefExoticComponent<ToastTitleProps & React.RefAttributes<HTMLDivElement>>;
declare const Description: React.ForwardRefExoticComponent<ToastDescriptionProps & React.RefAttributes<HTMLDivElement>>;
declare const Action: React.ForwardRefExoticComponent<ToastActionProps & React.RefAttributes<HTMLButtonElement>>;
declare const Close: React.ForwardRefExoticComponent<ToastCloseProps & React.RefAttributes<HTMLButtonElement>>;

export { Action, Close, Description, Provider, Root, Title, Toast, ToastAction, type ToastActionProps, ToastClose, type ToastCloseProps, ToastDescription, type ToastDescriptionProps, type ToastProps, ToastProvider, type ToastProviderProps, ToastTitle, type ToastTitleProps, ToastViewport, type ToastViewportProps, Viewport, createToastScope };
