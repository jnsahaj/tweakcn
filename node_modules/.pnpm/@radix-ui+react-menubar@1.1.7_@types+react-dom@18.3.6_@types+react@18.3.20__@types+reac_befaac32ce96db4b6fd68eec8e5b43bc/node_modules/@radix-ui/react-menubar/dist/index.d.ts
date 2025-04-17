import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _radix_ui_react_context from '@radix-ui/react-context';
import { Scope } from '@radix-ui/react-context';
import * as React from 'react';
import * as MenuPrimitive from '@radix-ui/react-menu';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { Primitive } from '@radix-ui/react-primitive';

type ScopedProps<P> = P & {
    __scopeMenubar?: Scope;
};
declare const createMenubarScope: _radix_ui_react_context.CreateScope;
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface MenubarProps extends PrimitiveDivProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    loop?: RovingFocusGroupProps['loop'];
    dir?: RovingFocusGroupProps['dir'];
}
declare const Menubar: React.ForwardRefExoticComponent<MenubarProps & React.RefAttributes<HTMLDivElement>>;
interface MenubarMenuProps {
    value?: string;
    children?: React.ReactNode;
}
declare const MenubarMenu: {
    (props: ScopedProps<MenubarMenuProps>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface MenubarTriggerProps extends PrimitiveButtonProps {
}
declare const MenubarTrigger: React.ForwardRefExoticComponent<MenubarTriggerProps & React.RefAttributes<HTMLButtonElement>>;
type MenuPortalProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Portal>;
interface MenubarPortalProps extends MenuPortalProps {
}
declare const MenubarPortal: React.FC<MenubarPortalProps>;
type MenuContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>;
interface MenubarContentProps extends Omit<MenuContentProps, 'onEntryFocus'> {
}
declare const MenubarContent: React.ForwardRefExoticComponent<MenubarContentProps & React.RefAttributes<HTMLDivElement>>;
type MenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
interface MenubarGroupProps extends MenuGroupProps {
}
declare const MenubarGroup: React.ForwardRefExoticComponent<MenubarGroupProps & React.RefAttributes<HTMLDivElement>>;
type MenuLabelProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>;
interface MenubarLabelProps extends MenuLabelProps {
}
declare const MenubarLabel: React.ForwardRefExoticComponent<MenubarLabelProps & React.RefAttributes<HTMLDivElement>>;
type MenuItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>;
interface MenubarItemProps extends MenuItemProps {
}
declare const MenubarItem: React.ForwardRefExoticComponent<MenubarItemProps & React.RefAttributes<HTMLDivElement>>;
type MenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>;
interface MenubarCheckboxItemProps extends MenuCheckboxItemProps {
}
declare const MenubarCheckboxItem: React.ForwardRefExoticComponent<MenubarCheckboxItemProps & React.RefAttributes<HTMLDivElement>>;
type MenuRadioGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>;
interface MenubarRadioGroupProps extends MenuRadioGroupProps {
}
declare const MenubarRadioGroup: React.ForwardRefExoticComponent<MenubarRadioGroupProps & React.RefAttributes<HTMLDivElement>>;
type MenuRadioItemProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>;
interface MenubarRadioItemProps extends MenuRadioItemProps {
}
declare const MenubarRadioItem: React.ForwardRefExoticComponent<MenubarRadioItemProps & React.RefAttributes<HTMLDivElement>>;
type MenuItemIndicatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.ItemIndicator>;
interface MenubarItemIndicatorProps extends MenuItemIndicatorProps {
}
declare const MenubarItemIndicator: React.ForwardRefExoticComponent<MenubarItemIndicatorProps & React.RefAttributes<HTMLSpanElement>>;
type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;
interface MenubarSeparatorProps extends MenuSeparatorProps {
}
declare const MenubarSeparator: React.ForwardRefExoticComponent<MenubarSeparatorProps & React.RefAttributes<HTMLDivElement>>;
type MenuArrowProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>;
interface MenubarArrowProps extends MenuArrowProps {
}
declare const MenubarArrow: React.ForwardRefExoticComponent<MenubarArrowProps & React.RefAttributes<SVGSVGElement>>;
interface MenubarSubProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}
declare const MenubarSub: React.FC<MenubarSubProps>;
type MenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>;
interface MenubarSubTriggerProps extends MenuSubTriggerProps {
}
declare const MenubarSubTrigger: React.ForwardRefExoticComponent<MenubarSubTriggerProps & React.RefAttributes<HTMLDivElement>>;
type MenuSubContentProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>;
interface MenubarSubContentProps extends MenuSubContentProps {
}
declare const MenubarSubContent: React.ForwardRefExoticComponent<MenubarSubContentProps & React.RefAttributes<HTMLDivElement>>;
declare const Root: React.ForwardRefExoticComponent<MenubarProps & React.RefAttributes<HTMLDivElement>>;
declare const Menu: {
    (props: ScopedProps<MenubarMenuProps>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const Trigger: React.ForwardRefExoticComponent<MenubarTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const Portal: React.FC<MenubarPortalProps>;
declare const Content: React.ForwardRefExoticComponent<MenubarContentProps & React.RefAttributes<HTMLDivElement>>;
declare const Group: React.ForwardRefExoticComponent<MenubarGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const Label: React.ForwardRefExoticComponent<MenubarLabelProps & React.RefAttributes<HTMLDivElement>>;
declare const Item: React.ForwardRefExoticComponent<MenubarItemProps & React.RefAttributes<HTMLDivElement>>;
declare const CheckboxItem: React.ForwardRefExoticComponent<MenubarCheckboxItemProps & React.RefAttributes<HTMLDivElement>>;
declare const RadioGroup: React.ForwardRefExoticComponent<MenubarRadioGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const RadioItem: React.ForwardRefExoticComponent<MenubarRadioItemProps & React.RefAttributes<HTMLDivElement>>;
declare const ItemIndicator: React.ForwardRefExoticComponent<MenubarItemIndicatorProps & React.RefAttributes<HTMLSpanElement>>;
declare const Separator: React.ForwardRefExoticComponent<MenubarSeparatorProps & React.RefAttributes<HTMLDivElement>>;
declare const Arrow: React.ForwardRefExoticComponent<MenubarArrowProps & React.RefAttributes<SVGSVGElement>>;
declare const Sub: React.FC<MenubarSubProps>;
declare const SubTrigger: React.ForwardRefExoticComponent<MenubarSubTriggerProps & React.RefAttributes<HTMLDivElement>>;
declare const SubContent: React.ForwardRefExoticComponent<MenubarSubContentProps & React.RefAttributes<HTMLDivElement>>;

export { Arrow, CheckboxItem, Content, Group, Item, ItemIndicator, Label, Menu, Menubar, MenubarArrow, type MenubarArrowProps, MenubarCheckboxItem, type MenubarCheckboxItemProps, MenubarContent, type MenubarContentProps, MenubarGroup, type MenubarGroupProps, MenubarItem, MenubarItemIndicator, type MenubarItemIndicatorProps, type MenubarItemProps, MenubarLabel, type MenubarLabelProps, MenubarMenu, type MenubarMenuProps, MenubarPortal, type MenubarPortalProps, type MenubarProps, MenubarRadioGroup, type MenubarRadioGroupProps, MenubarRadioItem, type MenubarRadioItemProps, MenubarSeparator, type MenubarSeparatorProps, MenubarSub, MenubarSubContent, type MenubarSubContentProps, type MenubarSubProps, MenubarSubTrigger, type MenubarSubTriggerProps, MenubarTrigger, type MenubarTriggerProps, Portal, RadioGroup, RadioItem, Root, Separator, Sub, SubContent, SubTrigger, Trigger, createMenubarScope };
