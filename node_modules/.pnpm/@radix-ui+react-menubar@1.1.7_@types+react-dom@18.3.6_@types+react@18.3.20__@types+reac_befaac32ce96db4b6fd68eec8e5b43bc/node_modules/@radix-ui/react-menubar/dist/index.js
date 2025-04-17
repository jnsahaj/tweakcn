"use strict";
"use client";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/react/menubar/src/index.ts
var index_exports = {};
__export(index_exports, {
  Arrow: () => Arrow2,
  CheckboxItem: () => CheckboxItem2,
  Content: () => Content2,
  Group: () => Group2,
  Item: () => Item3,
  ItemIndicator: () => ItemIndicator2,
  Label: () => Label2,
  Menu: () => Menu,
  Menubar: () => Menubar,
  MenubarArrow: () => MenubarArrow,
  MenubarCheckboxItem: () => MenubarCheckboxItem,
  MenubarContent: () => MenubarContent,
  MenubarGroup: () => MenubarGroup,
  MenubarItem: () => MenubarItem,
  MenubarItemIndicator: () => MenubarItemIndicator,
  MenubarLabel: () => MenubarLabel,
  MenubarMenu: () => MenubarMenu,
  MenubarPortal: () => MenubarPortal,
  MenubarRadioGroup: () => MenubarRadioGroup,
  MenubarRadioItem: () => MenubarRadioItem,
  MenubarSeparator: () => MenubarSeparator,
  MenubarSub: () => MenubarSub,
  MenubarSubContent: () => MenubarSubContent,
  MenubarSubTrigger: () => MenubarSubTrigger,
  MenubarTrigger: () => MenubarTrigger,
  Portal: () => Portal2,
  RadioGroup: () => RadioGroup2,
  RadioItem: () => RadioItem2,
  Root: () => Root3,
  Separator: () => Separator2,
  Sub: () => Sub2,
  SubContent: () => SubContent2,
  SubTrigger: () => SubTrigger2,
  Trigger: () => Trigger,
  createMenubarScope: () => createMenubarScope
});
module.exports = __toCommonJS(index_exports);

// packages/react/menubar/src/menubar.tsx
var React = __toESM(require("react"));
var import_react_collection = require("@radix-ui/react-collection");
var import_react_direction = require("@radix-ui/react-direction");
var import_primitive = require("@radix-ui/primitive");
var import_react_compose_refs = require("@radix-ui/react-compose-refs");
var import_react_context = require("@radix-ui/react-context");
var import_react_id = require("@radix-ui/react-id");
var MenuPrimitive = __toESM(require("@radix-ui/react-menu"));
var import_react_menu = require("@radix-ui/react-menu");
var RovingFocusGroup = __toESM(require("@radix-ui/react-roving-focus"));
var import_react_roving_focus = require("@radix-ui/react-roving-focus");
var import_react_primitive = require("@radix-ui/react-primitive");
var import_react_use_controllable_state = require("@radix-ui/react-use-controllable-state");
var import_jsx_runtime = require("react/jsx-runtime");
var MENUBAR_NAME = "Menubar";
var [Collection, useCollection, createCollectionScope] = (0, import_react_collection.createCollection)(MENUBAR_NAME);
var [createMenubarContext, createMenubarScope] = (0, import_react_context.createContextScope)(MENUBAR_NAME, [
  createCollectionScope,
  import_react_roving_focus.createRovingFocusGroupScope
]);
var useMenuScope = (0, import_react_menu.createMenuScope)();
var useRovingFocusGroupScope = (0, import_react_roving_focus.createRovingFocusGroupScope)();
var [MenubarContextProvider, useMenubarContext] = createMenubarContext(MENUBAR_NAME);
var Menubar = React.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeMenubar,
      value: valueProp,
      onValueChange,
      defaultValue,
      loop = true,
      dir,
      ...menubarProps
    } = props;
    const direction = (0, import_react_direction.useDirection)(dir);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const [value = "", setValue] = (0, import_react_use_controllable_state.useControllableState)({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue
    });
    const [currentTabStopId, setCurrentTabStopId] = React.useState(null);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      MenubarContextProvider,
      {
        scope: __scopeMenubar,
        value,
        onMenuOpen: React.useCallback(
          (value2) => {
            setValue(value2);
            setCurrentTabStopId(value2);
          },
          [setValue]
        ),
        onMenuClose: React.useCallback(() => setValue(""), [setValue]),
        onMenuToggle: React.useCallback(
          (value2) => {
            setValue((prevValue) => prevValue ? "" : value2);
            setCurrentTabStopId(value2);
          },
          [setValue]
        ),
        dir: direction,
        loop,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Provider, { scope: __scopeMenubar, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Slot, { scope: __scopeMenubar, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          RovingFocusGroup.Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation: "horizontal",
            loop,
            dir: direction,
            currentTabStopId,
            onCurrentTabStopIdChange: setCurrentTabStopId,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_primitive.Primitive.div, { role: "menubar", ...menubarProps, ref: forwardedRef })
          }
        ) }) })
      }
    );
  }
);
Menubar.displayName = MENUBAR_NAME;
var MENU_NAME = "MenubarMenu";
var [MenubarMenuProvider, useMenubarMenuContext] = createMenubarContext(MENU_NAME);
var MenubarMenu = (props) => {
  const { __scopeMenubar, value: valueProp, ...menuProps } = props;
  const autoValue = (0, import_react_id.useId)();
  const value = valueProp || autoValue || "LEGACY_REACT_AUTO_VALUE";
  const context = useMenubarContext(MENU_NAME, __scopeMenubar);
  const menuScope = useMenuScope(__scopeMenubar);
  const triggerRef = React.useRef(null);
  const wasKeyboardTriggerOpenRef = React.useRef(false);
  const open = context.value === value;
  React.useEffect(() => {
    if (!open) wasKeyboardTriggerOpenRef.current = false;
  }, [open]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    MenubarMenuProvider,
    {
      scope: __scopeMenubar,
      value,
      triggerId: (0, import_react_id.useId)(),
      triggerRef,
      contentId: (0, import_react_id.useId)(),
      wasKeyboardTriggerOpenRef,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        MenuPrimitive.Root,
        {
          ...menuScope,
          open,
          onOpenChange: (open2) => {
            if (!open2) context.onMenuClose();
          },
          modal: false,
          dir: context.dir,
          ...menuProps
        }
      )
    }
  );
};
MenubarMenu.displayName = MENU_NAME;
var TRIGGER_NAME = "MenubarTrigger";
var MenubarTrigger = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...triggerProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const menuScope = useMenuScope(__scopeMenubar);
    const context = useMenubarContext(TRIGGER_NAME, __scopeMenubar);
    const menuContext = useMenubarMenuContext(TRIGGER_NAME, __scopeMenubar);
    const ref = React.useRef(null);
    const composedRefs = (0, import_react_compose_refs.useComposedRefs)(forwardedRef, ref, menuContext.triggerRef);
    const [isFocused, setIsFocused] = React.useState(false);
    const open = context.value === menuContext.value;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.ItemSlot, { scope: __scopeMenubar, value: menuContext.value, disabled, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RovingFocusGroup.Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        tabStopId: menuContext.value,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.Anchor, { asChild: true, ...menuScope, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_react_primitive.Primitive.button,
          {
            type: "button",
            role: "menuitem",
            id: menuContext.triggerId,
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-controls": open ? menuContext.contentId : void 0,
            "data-highlighted": isFocused ? "" : void 0,
            "data-state": open ? "open" : "closed",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            ...triggerProps,
            ref: composedRefs,
            onPointerDown: (0, import_primitive.composeEventHandlers)(props.onPointerDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onMenuOpen(menuContext.value);
                if (!open) event.preventDefault();
              }
            }),
            onPointerEnter: (0, import_primitive.composeEventHandlers)(props.onPointerEnter, () => {
              const menubarOpen = Boolean(context.value);
              if (menubarOpen && !open) {
                context.onMenuOpen(menuContext.value);
                ref.current?.focus();
              }
            }),
            onKeyDown: (0, import_primitive.composeEventHandlers)(props.onKeyDown, (event) => {
              if (disabled) return;
              if (["Enter", " "].includes(event.key)) context.onMenuToggle(menuContext.value);
              if (event.key === "ArrowDown") context.onMenuOpen(menuContext.value);
              if (["Enter", " ", "ArrowDown"].includes(event.key)) {
                menuContext.wasKeyboardTriggerOpenRef.current = true;
                event.preventDefault();
              }
            }),
            onFocus: (0, import_primitive.composeEventHandlers)(props.onFocus, () => setIsFocused(true)),
            onBlur: (0, import_primitive.composeEventHandlers)(props.onBlur, () => setIsFocused(false))
          }
        ) })
      }
    ) });
  }
);
MenubarTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "MenubarPortal";
var MenubarPortal = (props) => {
  const { __scopeMenubar, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.Portal, { ...menuScope, ...portalProps });
};
MenubarPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "MenubarContent";
var MenubarContent = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, align = "start", ...contentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    const context = useMenubarContext(CONTENT_NAME, __scopeMenubar);
    const menuContext = useMenubarMenuContext(CONTENT_NAME, __scopeMenubar);
    const getItems = useCollection(__scopeMenubar);
    const hasInteractedOutsideRef = React.useRef(false);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      MenuPrimitive.Content,
      {
        id: menuContext.contentId,
        "aria-labelledby": menuContext.triggerId,
        "data-radix-menubar-content": "",
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        align,
        onCloseAutoFocus: (0, import_primitive.composeEventHandlers)(props.onCloseAutoFocus, (event) => {
          const menubarOpen = Boolean(context.value);
          if (!menubarOpen && !hasInteractedOutsideRef.current) {
            menuContext.triggerRef.current?.focus();
          }
          hasInteractedOutsideRef.current = false;
          event.preventDefault();
        }),
        onFocusOutside: (0, import_primitive.composeEventHandlers)(props.onFocusOutside, (event) => {
          const target = event.target;
          const isMenubarTrigger = getItems().some((item) => item.ref.current?.contains(target));
          if (isMenubarTrigger) event.preventDefault();
        }),
        onInteractOutside: (0, import_primitive.composeEventHandlers)(props.onInteractOutside, () => {
          hasInteractedOutsideRef.current = true;
        }),
        onEntryFocus: (event) => {
          if (!menuContext.wasKeyboardTriggerOpenRef.current) event.preventDefault();
        },
        onKeyDown: (0, import_primitive.composeEventHandlers)(
          props.onKeyDown,
          (event) => {
            if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
              const target = event.target;
              const targetIsSubTrigger = target.hasAttribute("data-radix-menubar-subtrigger");
              const isKeyDownInsideSubMenu = target.closest("[data-radix-menubar-content]") !== event.currentTarget;
              const prevMenuKey = context.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
              const isPrevKey = prevMenuKey === event.key;
              const isNextKey = !isPrevKey;
              if (isNextKey && targetIsSubTrigger) return;
              if (isKeyDownInsideSubMenu && isPrevKey) return;
              const items = getItems().filter((item) => !item.disabled);
              let candidateValues = items.map((item) => item.value);
              if (isPrevKey) candidateValues.reverse();
              const currentIndex = candidateValues.indexOf(menuContext.value);
              candidateValues = context.loop ? wrapArray(candidateValues, currentIndex + 1) : candidateValues.slice(currentIndex + 1);
              const [nextValue] = candidateValues;
              if (nextValue) context.onMenuOpen(nextValue);
            }
          },
          { checkForDefaultPrevented: false }
        ),
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-menubar-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-menubar-content-available-width": "var(--radix-popper-available-width)",
            "--radix-menubar-content-available-height": "var(--radix-popper-available-height)",
            "--radix-menubar-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-menubar-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
MenubarContent.displayName = CONTENT_NAME;
var GROUP_NAME = "MenubarGroup";
var MenubarGroup = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
MenubarGroup.displayName = GROUP_NAME;
var LABEL_NAME = "MenubarLabel";
var MenubarLabel = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
MenubarLabel.displayName = LABEL_NAME;
var ITEM_NAME = "MenubarItem";
var MenubarItem = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.Item, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
MenubarItem.displayName = ITEM_NAME;
var CHECKBOX_ITEM_NAME = "MenubarCheckboxItem";
var MenubarCheckboxItem = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...checkboxItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
  }
);
MenubarCheckboxItem.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "MenubarRadioGroup";
var MenubarRadioGroup = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...radioGroupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
  }
);
MenubarRadioGroup.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "MenubarRadioItem";
var MenubarRadioItem = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...radioItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
  }
);
MenubarRadioItem.displayName = RADIO_ITEM_NAME;
var INDICATOR_NAME = "MenubarItemIndicator";
var MenubarItemIndicator = React.forwardRef((props, forwardedRef) => {
  const { __scopeMenubar, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
MenubarItemIndicator.displayName = INDICATOR_NAME;
var SEPARATOR_NAME = "MenubarSeparator";
var MenubarSeparator = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...separatorProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
  }
);
MenubarSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "MenubarArrow";
var MenubarArrow = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.Arrow, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
MenubarArrow.displayName = ARROW_NAME;
var SUB_NAME = "MenubarSub";
var MenubarSub = (props) => {
  const { __scopeMenubar, children, open: openProp, onOpenChange, defaultOpen } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  const [open = false, setOpen] = (0, import_react_use_controllable_state.useControllableState)({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPrimitive.Sub, { ...menuScope, open, onOpenChange: setOpen, children });
};
MenubarSub.displayName = SUB_NAME;
var SUB_TRIGGER_NAME = "MenubarSubTrigger";
var MenubarSubTrigger = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...subTriggerProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      MenuPrimitive.SubTrigger,
      {
        "data-radix-menubar-subtrigger": "",
        ...menuScope,
        ...subTriggerProps,
        ref: forwardedRef
      }
    );
  }
);
MenubarSubTrigger.displayName = SUB_TRIGGER_NAME;
var SUB_CONTENT_NAME = "MenubarSubContent";
var MenubarSubContent = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...subContentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      MenuPrimitive.SubContent,
      {
        ...menuScope,
        "data-radix-menubar-content": "",
        ...subContentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-menubar-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-menubar-content-available-width": "var(--radix-popper-available-width)",
            "--radix-menubar-content-available-height": "var(--radix-popper-available-height)",
            "--radix-menubar-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-menubar-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
MenubarSubContent.displayName = SUB_CONTENT_NAME;
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root3 = Menubar;
var Menu = MenubarMenu;
var Trigger = MenubarTrigger;
var Portal2 = MenubarPortal;
var Content2 = MenubarContent;
var Group2 = MenubarGroup;
var Label2 = MenubarLabel;
var Item3 = MenubarItem;
var CheckboxItem2 = MenubarCheckboxItem;
var RadioGroup2 = MenubarRadioGroup;
var RadioItem2 = MenubarRadioItem;
var ItemIndicator2 = MenubarItemIndicator;
var Separator2 = MenubarSeparator;
var Arrow2 = MenubarArrow;
var Sub2 = MenubarSub;
var SubTrigger2 = MenubarSubTrigger;
var SubContent2 = MenubarSubContent;
//# sourceMappingURL=index.js.map
