"use client";

import { CircleCheck } from "lucide-react";
import ControlSection from "@/components/editor/control-section";
import { useEditorStore } from "@/store/editor-store";
import { useColorControlFocus, type FocusColorId } from "@/store/color-control-focus-store";
import { COLOR_KEYS } from "../generate-css";
import type { CheckResult } from "../theme-check";
import { useThemeCheck } from "../use-theme-check";
import { MODE_LABEL, StatusIcon } from "./check-notes";

const GROUPS: { key: "light" | "dark" | null; title: string }[] = [
  { key: "light", title: "Light mode" },
  { key: "dark", title: "Dark mode" },
  { key: null, title: "Whole theme" },
];

/**
 * "Theme check" section of the Brand tab: every error and warning from the app shell's theme:check rules,
 * run live on the theme being edited. Clicking a colour issue switches to its mode and jumps to the token.
 */
export function ThemeCheckSection() {
  const { issues, fails, warns } = useThemeCheck();
  const themeState = useEditorStore((s) => s.themeState);
  const setThemeState = useEditorStore((s) => s.setThemeState);
  const { focusColor, colorRefsHas } = useFocusHelpers();

  const open = (r: CheckResult) => {
    const token = r.tokens.find(colorRefsHas) as FocusColorId | undefined;
    if (!token) return;
    if (r.modeKey && r.modeKey !== themeState.currentMode) setThemeState({ ...themeState, currentMode: r.modeKey });
    focusColor(token);
  };

  return (
    <ControlSection title="Theme check" expanded>
      <div className="flex flex-col gap-3 pb-2">
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          The app shell&apos;s <code className="font-mono">theme:check</code> rules, run live on the App shell export.
          Errors don&apos;t block export, but the app shell&apos;s check will fail.
        </p>

        <div className="flex items-center gap-3 text-xs">
          {fails === 0 && warns === 0 ? (
            <span className="flex items-center gap-1.5">
              <CircleCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" /> All checks pass
            </span>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <StatusIcon status="fail" className="size-3.5" /> {fails} {fails === 1 ? "error" : "errors"}
              </span>
              <span className="flex items-center gap-1.5">
                <StatusIcon status="warn" className="size-3.5" /> {warns} {warns === 1 ? "warning" : "warnings"}
              </span>
            </>
          )}
        </div>

        {GROUPS.map(({ key, title }) => {
          const rows = issues.filter((r) => r.modeKey === key);
          if (!rows.length) return null;
          return (
            <div key={title} className="flex flex-col gap-1">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">{title}</span>
              <ul className="flex flex-col">
                {rows.map((r, i) => {
                  const clickable = r.tokens.some(colorRefsHas);
                  const body = (
                    <>
                      <StatusIcon status={r.status} className="mt-0.5" />
                      <span className="min-w-0">
                        <span className="text-foreground block text-xs">{r.check}</span>
                        <span className="text-muted-foreground block text-[11px] leading-snug">{r.detail}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={i}>
                      {clickable ? (
                        <button
                          type="button"
                          onClick={() => open(r)}
                          title={`Show in Colors${r.modeKey ? ` (${MODE_LABEL[r.modeKey]} mode)` : ""}`}
                          className="hover:bg-muted/60 flex w-full items-start gap-2 rounded-md px-1.5 py-1 text-left transition-colors"
                        >
                          {body}
                        </button>
                      ) : (
                        <div className="flex items-start gap-2 px-1.5 py-1">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </ControlSection>
  );
}

const COLOR_TOKENS = new Set<string>(COLOR_KEYS);

function useFocusHelpers() {
  const { focusColor } = useColorControlFocus();
  return { focusColor, colorRefsHas: (t: string) => COLOR_TOKENS.has(t) };
}
