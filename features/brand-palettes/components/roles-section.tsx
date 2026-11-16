"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import ControlSection from "@/components/editor/control-section";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ROLES, ROLE_LABELS, type RoleId } from "../roles";
import { useBrandPalettes, useBrandRoles, useTokenRoleStatuses } from "../use-brand-palettes";

const ROLE_HINTS: Record<RoleId, string> = {
  primary: "Buttons, links, focus rings, charts",
  secondary: "Secondary buttons, accents, charts",
  neutral: "Backgrounds, text, borders, muted surfaces",
  destructive: "Errors and destructive actions (optional)",
};

const NONE = "__none__";

/** "Roles" section of the Brand tab: assign palettes to roles; tokens follow automatically. */
export function RolesSection() {
  const { palettes } = useBrandPalettes();
  const { assignments, whiteBackground, manualCount, assign, setWhiteBackground, resetAllToAuto } =
    useBrandRoles();
  const { statuses } = useTokenRoleStatuses();
  const warnings = Object.entries(statuses).filter(([, s]) => s?.kind === "auto" && s.warning);

  return (
    <ControlSection title="Roles" expanded>
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Pick a palette per role and every token follows automatically, in light and dark mode. Change a token in
          the Colors tab to override it.
        </p>

        {palettes.length === 0 && (
          <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-2 text-xs">
            Add a brand colour above to assign it to a role.
          </p>
        )}

        {ROLES.map((role) => (
          <div key={role} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-foreground text-[13px] font-medium">{ROLE_LABELS[role]}</div>
                <div className="text-muted-foreground truncate text-[11px]">{ROLE_HINTS[role]}</div>
              </div>
              <Select
                value={assignments[role] ?? NONE}
                onValueChange={(v) => assign(role, v === NONE ? null : v)}
                disabled={palettes.length === 0}
              >
                <SelectTrigger size="sm" className="h-7 w-36 text-xs" aria-label={`${ROLE_LABELS[role]} palette`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value={NONE} className="text-xs">
                    <span className="text-muted-foreground">Not assigned</span>
                  </SelectItem>
                  {palettes.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      <span className="flex h-3 w-6 shrink-0 overflow-hidden rounded-sm border">
                        {([200, 500, 800] as const).map((s) => (
                          <span key={s} className="flex-1" style={{ background: p.steps[s].value }} />
                        ))}
                      </span>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {role === "neutral" && assignments.neutral && (
              <div className="flex items-center justify-between gap-2 pl-0.5">
                <span className="text-muted-foreground text-[11px]">Light background</span>
                <div className="bg-muted flex rounded-md p-0.5 text-[11px]" role="radiogroup" aria-label="Light background">
                  {[
                    { white: false, label: "Neutral 50" },
                    { white: true, label: "White" },
                  ].map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      role="radio"
                      aria-checked={whiteBackground === o.white}
                      onClick={() => setWhiteBackground(o.white)}
                      className={cn(
                        "rounded px-2 py-0.5 transition-colors",
                        whiteBackground === o.white
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {warnings.length > 0 && (
          <div className="flex gap-2 rounded-lg border border-amber-500/40 bg-amber-500/5 px-2.5 py-2 text-[11px]">
            <AlertTriangle className="mt-px size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex flex-col gap-0.5">
              <span className="text-foreground font-medium">Contrast warnings in this mode</span>
              {warnings.map(([token, s]) => (
                <span key={token} className="text-muted-foreground">
                  <span className="text-foreground font-mono">{token}</span>:{" "}
                  {s?.kind === "auto" ? s.warning : null}
                </span>
              ))}
            </div>
          </div>
        )}

        {manualCount > 0 && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-[11px]">
              {manualCount} token{manualCount === 1 ? "" : "s"} set manually (light + dark)
            </span>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetAllToAuto}>
              <RotateCcw className="size-3" /> Reset all to Auto
            </Button>
          </div>
        )}
      </div>
    </ControlSection>
  );
}
