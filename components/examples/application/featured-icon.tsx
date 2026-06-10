import * as React from "react";

import { cn } from "@/lib/utils";

export function FeaturedIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-muted [&_svg:not([class*='text-'])]:text-primary flex size-12 shrink-0 items-center justify-center rounded-md border [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}
