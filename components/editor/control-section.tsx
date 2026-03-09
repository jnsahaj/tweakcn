import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ControlSectionProps } from "@/types";
import { SectionContext } from "./section-context";

const ControlSection = ({ title, children, expanded = false, className, headerAction }: ControlSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <SectionContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        toggleExpanded: () => setIsExpanded((prev) => !prev),
      }}
    >
      <div className="group/accordion">
        <div className="flex items-center gap-1 py-1">
          <button
            type="button"
            className="group/section flex items-center transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            <div className="bg-muted group-hover/section:bg-muted/80 group-has-focus-within/accordion:bg-muted/70 flex items-center gap-1 rounded-md border border-transparent px-2 py-0.5 transition-all group-has-focus-within/accordion:border-ring/50">
              <ChevronRight
                className={cn(
                  "text-muted-foreground size-3 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )}
              />
              <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                {title}
              </span>
            </div>
          </button>
          {headerAction}
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className={cn("flex flex-col pt-1 pb-2", className)}>{children}</div>
        </div>
      </div>
    </SectionContext.Provider>
  );
};

export default ControlSection;
