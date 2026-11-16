"use client";

import { CircleCheck } from "lucide-react";
import type { ThemeStyles } from "@/types/theme";
import { themeCheckFor } from "../theme-check";
import { StatusIcon, resultLine } from "./check-notes";

/**
 * Shown above the exported code. Export is always allowed; with errors the app shell's theme:check will fail,
 * so say so clearly and list what to fix.
 */
export function ExportCheckBanner({ styles }: { styles: ThemeStyles }) {
  const { issues, fails, warns } = themeCheckFor(styles);

  if (fails === 0) {
    return (
      <div className="text-muted-foreground mb-3 flex items-center gap-2 rounded-md border px-3 py-2 text-xs">
        <CircleCheck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        Passes the app shell&apos;s theme:check{warns ? ` (${warns} ${warns === 1 ? "warning" : "warnings"})` : ""}.
      </div>
    );
  }

  return (
    <details className="mb-3 rounded-md border border-red-600/40 bg-red-500/5 px-3 py-2 text-xs dark:border-red-400/40">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-red-700 dark:text-red-400">
        <StatusIcon status="fail" className="size-3.5" />
        This theme has {fails} {fails === 1 ? "error" : "errors"}
        {warns ? ` and ${warns} ${warns === 1 ? "warning" : "warnings"}` : ""}. You can still export, but
        theme:check in the app shell will fail.
        <span className="text-muted-foreground ml-auto shrink-0 font-normal underline">Details</span>
      </summary>
      <ul className="mt-2 flex flex-col gap-1">
        {issues
          .filter((r) => r.status !== "info")
          .map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <StatusIcon status={r.status} className="mt-0.5" />
              <span className="text-muted-foreground">{resultLine(r)}</span>
            </li>
          ))}
      </ul>
    </details>
  );
}
