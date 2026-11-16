"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { ROLE_LABELS, type TokenRoleStatus } from "../roles";

/** Small line under a token's label: "Auto · Primary 700" or "Manual ↺". */
export function RoleStatus({ status, onReset }: { status: TokenRoleStatus; onReset: () => void }) {
  if (!status) return null;

  if (status.kind === "manual") {
    return (
      <span className="text-muted-foreground flex items-center gap-1 text-[10px] leading-none">
        <span className="text-foreground/80 font-medium">Manual</span>
        <TooltipWrapper label={`Return to the ${ROLE_LABELS[status.role]} rule`} asChild>
          <button
            type="button"
            onClick={onReset}
            className="hover:text-foreground inline-flex items-center gap-0.5 transition-colors"
            aria-label="Reset to Auto"
          >
            <RotateCcw className="size-2.5" /> Auto
          </button>
        </TooltipWrapper>
      </span>
    );
  }

  return (
    <span className="text-muted-foreground flex items-center gap-1 text-[10px] leading-none">
      <span className="truncate">Auto · {status.label}</span>
      {status.warning && (
        <TooltipWrapper label={status.warning} asChild>
          <span aria-label={status.warning} className="inline-flex">
            <AlertTriangle className="size-3 text-amber-600 dark:text-amber-400" />
          </span>
        </TooltipWrapper>
      )}
    </span>
  );
}
