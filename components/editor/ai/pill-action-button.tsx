import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export interface AIPillActionButtonProps extends ComponentProps<typeof Button> {}

export function PillActionButton({
  className,
  children,
  disabled,
  ...props
}: AIPillActionButtonProps) {
  return (
    <div className={cn("group/pill relative active:scale-95", disabled && "pointer-events-none")}>
      <div className="from-primary to-background absolute inset-0 z-[-1] rounded-full bg-gradient-to-br opacity-0 transition-all duration-150 ease-in group-hover/pill:opacity-30" />
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "hover:bg-muted/50 text-muted-foreground hover:text-foreground border-border/80! rounded-full border bg-transparent font-medium text-nowrap whitespace-nowrap backdrop-blur-md transition-all duration-150 ease-in select-none focus:outline-none",
          "group-hover/pill:inset-shadow-primary/50 gap-1.5 inset-shadow-2xs inset-shadow-transparent [&>svg]:size-3",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
}
