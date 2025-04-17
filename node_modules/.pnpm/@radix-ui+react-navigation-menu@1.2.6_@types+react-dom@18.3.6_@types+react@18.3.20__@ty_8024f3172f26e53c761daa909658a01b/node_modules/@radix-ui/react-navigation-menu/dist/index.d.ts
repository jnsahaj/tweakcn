import * as _radix_ui_react_context from '@radix-ui/react-context';
import { Scope } from '@radix-ui/react-context';
import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

type Orientation = 'vertical' | 'horizontal';
type Direction = 'ltr' | 'rtl';
declare const createNavigationMenuScope: _radix_ui_react_context.CreateScope;
type NavigationMenuElement = React.ElementRef<typeof Primitive.nav>;
type PrimitiveNavProps = React.ComponentPropsWithoutRef<typeof Primitive.nav>;
interface NavigationMenuProps extends Omit<NavigationMenuProviderProps, keyof NavigationMenuProviderPrivateProps>, PrimitiveNavProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    dir?: Direction;
    orientation?: Orientation;
    /**
     * The duration from when the pointer enters the trigger until the tooltip gets opened.
     * @defaultValue 200
     */
    delayDuration?: number;
    /**
     * How much time a user has to enter another trigger without incurring a delay again.
     * @defaultValue 300
     */
    skipDelayDuration?: number;
}
declare const NavigationMenu: React.ForwardRefExoticComponent<NavigationMenuProps & React.RefAttributes<HTMLElement>>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface NavigationMenuSubProps extends Omit<NavigationMenuProviderProps, keyof NavigationMenuProviderPrivateProps>, PrimitiveDivProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    orientation?: Orientation;
}
declare const NavigationMenuSub: React.ForwardRefExoticComponent<NavigationMenuSubProps & React.RefAttributes<HTMLDivElement>>;
interface NavigationMenuProviderPrivateProps {
    isRootMenu: boolean;
    scope: Scope;
    children: React.ReactNode;
    orientation: Orientation;
    dir: Direction;
    rootNavigationMenu: NavigationMenuElement | null;
    value: string;
    onTriggerEnter(itemValue: string): void;
    onTriggerLeave?(): void;
    onContentEnter?(): void;
    onContentLeave?(): void;
    onItemSelect(itemValue: string): void;
    onItemDismiss(): void;
}
interface NavigationMenuProviderProps extends NavigationMenuProviderPrivateProps {
}
type PrimitiveUnorderedListProps = React.ComponentPropsWithoutRef<typeof Primitive.ul>;
interface NavigationMenuListProps extends PrimitiveUnorderedListProps {
}
declare const NavigationMenuList: React.ForwardRefExoticComponent<NavigationMenuListProps & React.RefAttributes<HTMLUListElement>>;
type FocusProxyElement = React.ElementRef<typeof VisuallyHiddenPrimitive.Root>;
type PrimitiveListItemProps = React.ComponentPropsWithoutRef<typeof Primitive.li>;
interface NavigationMenuItemProps extends PrimitiveListItemProps {
    value?: string;
}
declare const NavigationMenuItem: React.ForwardRefExoticComponent<NavigationMenuItemProps & React.RefAttributes<HTMLLIElement>>;
type NavigationMenuTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface NavigationMenuTriggerProps extends PrimitiveButtonProps {
}
declare const NavigationMenuTrigger: React.ForwardRefExoticComponent<NavigationMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>;
interface NavigationMenuLinkProps extends Omit<PrimitiveLinkProps, 'onSelect'> {
    active?: boolean;
    onSelect?: (event: Event) => void;
}
declare const NavigationMenuLink: React.ForwardRefExoticComponent<NavigationMenuLinkProps & React.RefAttributes<HTMLAnchorElement>>;
interface NavigationMenuIndicatorProps extends NavigationMenuIndicatorImplProps {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const NavigationMenuIndicator: React.ForwardRefExoticComponent<NavigationMenuIndicatorProps & React.RefAttributes<HTMLDivElement>>;
interface NavigationMenuIndicatorImplProps extends PrimitiveDivProps {
}
interface NavigationMenuContentProps extends Omit<NavigationMenuContentImplProps, keyof NavigationMenuContentImplPrivateProps> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const NavigationMenuContent: React.ForwardRefExoticComponent<NavigationMenuContentProps & React.RefAttributes<HTMLDivElement>>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;
interface NavigationMenuContentImplPrivateProps {
    value: string;
    triggerRef: React.RefObject<NavigationMenuTriggerElement | null>;
    focusProxyRef: React.RefObject<FocusProxyElement | null>;
    wasEscapeCloseRef: React.MutableRefObject<boolean>;
    onContentFocusOutside(): void;
    onRootContentClose(): void;
}
interface NavigationMenuContentImplProps extends Omit<DismissableLayerProps, 'onDismiss' | 'disableOutsidePointerEvents'>, NavigationMenuContentImplPrivateProps {
}
interface NavigationMenuViewportProps extends Omit<NavigationMenuViewportImplProps, 'activeContentValue'> {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
}
declare const NavigationMenuViewport: React.ForwardRefExoticComponent<NavigationMenuViewportProps & React.RefAttributes<HTMLDivElement>>;
interface NavigationMenuViewportImplProps extends PrimitiveDivProps {
}
declare const Root: React.ForwardRefExoticComponent<NavigationMenuProps & React.RefAttributes<HTMLElement>>;
declare const Sub: React.ForwardRefExoticComponent<NavigationMenuSubProps & React.RefAttributes<HTMLDivElement>>;
declare const List: React.ForwardRefExoticComponent<NavigationMenuListProps & React.RefAttributes<HTMLUListElement>>;
declare const Item: React.ForwardRefExoticComponent<NavigationMenuItemProps & React.RefAttributes<HTMLLIElement>>;
declare const Trigger: React.ForwardRefExoticComponent<NavigationMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const Link: React.ForwardRefExoticComponent<NavigationMenuLinkProps & React.RefAttributes<HTMLAnchorElement>>;
declare const Indicator: React.ForwardRefExoticComponent<NavigationMenuIndicatorProps & React.RefAttributes<HTMLDivElement>>;
declare const Content: React.ForwardRefExoticComponent<NavigationMenuContentProps & React.RefAttributes<HTMLDivElement>>;
declare const Viewport: React.ForwardRefExoticComponent<NavigationMenuViewportProps & React.RefAttributes<HTMLDivElement>>;

export { Content, Indicator, Item, Link, List, NavigationMenu, NavigationMenuContent, type NavigationMenuContentProps, NavigationMenuIndicator, type NavigationMenuIndicatorProps, NavigationMenuItem, type NavigationMenuItemProps, NavigationMenuLink, type NavigationMenuLinkProps, NavigationMenuList, type NavigationMenuListProps, type NavigationMenuProps, NavigationMenuSub, type NavigationMenuSubProps, NavigationMenuTrigger, type NavigationMenuTriggerProps, NavigationMenuViewport, type NavigationMenuViewportProps, Root, Sub, Trigger, Viewport, createNavigationMenuScope };
