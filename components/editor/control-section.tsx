import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ControlSectionProps } from "@/types";
import { SectionContext } from "./section-context";

const ControlSection = ({ title, children, expanded = false, className }: ControlSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <SectionContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        toggleExpanded: () => setIsExpanded((prev) => !prev),
      }}
    >
      <div className={cn("mb-4 overflow-hidden rounded-lg border")}>
        <div
          className="bg-background hover:bg-muted flex cursor-pointer items-center justify-between p-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-sm font-medium">{title}</h3>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className={cn("bg-background border-t p-3", className)}>{children}</div>
        </div>
      </div>
    </SectionContext.Provider>
  );
};

export default ControlSection;
