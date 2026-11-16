"use client";

import { AlertTriangle, CircleX, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CheckResult, CheckStatus } from "../theme-check";
import { useThemeCheck } from "../use-theme-check";

export const MODE_LABEL: Record<string, string> = { light: "Light", dark: "Dark" };

export function StatusIcon({ status, className }: { status: CheckStatus; className?: string }) {
  if (status === "fail") return <CircleX className={cn("size-3 shrink-0 text-red-600 dark:text-red-400", className)} />;
  if (status === "warn")
    return <AlertTriangle className={cn("size-3 shrink-0 text-amber-600 dark:text-amber-400", className)} />;
  return <Info className={cn("text-muted-foreground size-3 shrink-0", className)} />;
}

export const resultLine = (r: CheckResult) =>
  `${r.modeKey ? `${MODE_LABEL[r.modeKey]}: ` : ""}${r.check} – ${r.detail}`;

/** Unique results for these tokens, worst first. */
export function useTokenIssues(tokens: string[]): CheckResult[] {
  const { byToken } = useThemeCheck();
  const seen = new Set<CheckResult>();
  for (const t of tokens) for (const r of byToken[t] ?? []) seen.add(r);
  const order = { fail: 0, warn: 1, info: 2, pass: 3 };
  return [...seen].sort((a, b) => order[a.status] - order[b.status]);
}

/**
 * Compact line under a control: the worst issue for these tokens (light and dark mode), the rest in a tooltip.
 * Renders nothing when the tokens pass every check.
 */
export function CheckNotes({ tokens, className }: { tokens: string[]; className?: string }) {
  const issues = useTokenIssues(tokens);
  if (!issues.length) return null;
  const [first] = issues;
  const more = issues.length - 1;
  const short = `${first.modeKey ? `${MODE_LABEL[first.modeKey]} · ` : ""}${first.check.replace(/^(Tekst|Grafik): /, "")}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn("flex min-w-0 items-center gap-1 text-[10px] leading-none", className)}
          aria-label={issues.map(resultLine).join(". ")}
        >
          <StatusIcon status={first.status} />
          <span
            className={cn(
              "truncate",
              first.status === "fail" ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
            )}
          >
            {short}
          </span>
          {more > 0 && <span className="text-muted-foreground shrink-0">+{more}</span>}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <span className="flex max-w-80 flex-col gap-1 text-left">
          {issues.map((r, i) => (
            <span key={i}>{resultLine(r)}</span>
          ))}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
