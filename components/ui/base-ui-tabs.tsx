import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui-components/react/tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "bg-muted text-muted-foreground relative inline-flex h-10 items-center justify-center rounded-md p-1",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsIndicator = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Indicator
    ref={ref}
    className={cn(
      "bg-secondary absolute top-1/2 left-0 z-0 h-7 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-full shadow-xs transition-all duration-200 ease-in-out",
      className
    )}
    {...props}
  />
));
TabsIndicator.displayName = TabsPrimitive.Indicator.displayName;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Tab>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tab>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Tab
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:ring-ring data-selected:text-foreground z-1 inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Tab.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Panel>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Panel.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator };
