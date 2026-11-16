"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { wcagContrast } from "culori";
import { Lock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEBOUNCE_DELAY } from "@/lib/constants";
import { useEditorStore } from "@/store/editor-store";
import { debounce } from "@/utils/debounce";
import { parseToOklch, toHex, type ScaleStep } from "../scale";
import { refFor, getActiveRef } from "../palette";
import type { BrandPalette } from "../types";

/** "4.82 AA", "3.10 AA large", "2.10" */
export function contrastLabel(ratio: number) {
  const r = ratio.toFixed(2);
  if (ratio >= 7) return `${r} AAA`;
  if (ratio >= 4.5) return `${r} AA`;
  if (ratio >= 3) return `${r} AA large`;
  return r;
}

export function contrastSummary(value: string) {
  return `vs white ${contrastLabel(wcagContrast(value, "#ffffff"))} · vs black ${contrastLabel(wcagContrast(value, "#000000"))}`;
}

type StepEditorProps = {
  palette: BrandPalette;
  step: ScaleStep;
  onChange: (colour: string) => void;
  onReset: () => void;
};

/** Popover body for editing one step: picker, hex/oklch input, lock + reset, contrast, usage. */
export function StepEditor({ palette, step, onChange, onReset }: StepEditorProps) {
  const { value, locked } = palette.steps[step];
  const ref = refFor(palette.slug, step);
  const [text, setText] = useState(value);
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the text field in sync with outside changes (undo, reset), unless the user is typing in it.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setText(value);
      setInvalid(false);
    }
  }, [value]);

  const debouncedChange = useMemo(() => debounce((c: string) => onChange(c), DEBOUNCE_DELAY), [onChange]);
  useEffect(() => () => debouncedChange.cancel(), [debouncedChange]);

  const usedBy = useEditorStore((s) => {
    const out: string[] = [];
    for (const mode of ["light", "dark"] as const) {
      for (const token of Object.keys(s.themeState.brandRefs?.[mode] ?? {})) {
        if (getActiveRef(s.themeState, mode, token) === ref) out.push(`${token} (${mode})`);
      }
    }
    return out.join(", ");
  });

  const white = wcagContrast(value, "#ffffff");
  const black = wcagContrast(value, "#000000");
  const oklch = parseToOklch(value);

  return (
    <div className="flex w-64 flex-col gap-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium">{ref}</span>
        <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
          {palette.anchorStep === step && !locked && "Brand colour"}
          {locked && (
            <>
              <Lock className="size-3" /> Edited
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="relative size-9 shrink-0 overflow-hidden rounded-md border shadow-sm"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={toHex(value) ?? "#000000"}
            onChange={(e) => {
              setText(e.target.value);
              debouncedChange(e.target.value);
            }}
            aria-label={`Pick colour for ${ref}`}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => {
              const v = e.target.value;
              setText(v);
              const ok = !!parseToOklch(v);
              setInvalid(!ok);
              if (ok) debouncedChange(v);
            }}
            onBlur={() => {
              if (invalid) {
                setText(value);
                setInvalid(false);
              }
            }}
            placeholder="hex or oklch"
            aria-label={`${ref} value`}
            aria-invalid={invalid}
            className="bg-muted/50 text-foreground focus:border-ring aria-invalid:border-destructive h-7 w-full min-w-0 rounded border px-2 font-mono text-[11px] outline-none"
          />
          <span className="text-muted-foreground font-mono text-[10px]">
            {toHex(value)}
            {oklch && ` · L ${oklch.l.toFixed(3)}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 text-[11px]">
        <div className="flex items-center gap-1.5 rounded border px-1.5 py-1" title="WCAG contrast against white">
          <span className="size-3 rounded-sm border" style={{ background: "#fff" }} />
          <span style={{ color: value }} className="rounded bg-white px-1 font-semibold">
            Aa
          </span>
          <span className="text-muted-foreground tabular-nums">{contrastLabel(white)}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded border px-1.5 py-1" title="WCAG contrast against black">
          <span className="size-3 rounded-sm border" style={{ background: "#000" }} />
          <span style={{ color: value }} className="rounded bg-black px-1 font-semibold">
            Aa
          </span>
          <span className="text-muted-foreground tabular-nums">{contrastLabel(black)}</span>
        </div>
      </div>

      {usedBy && <p className="text-muted-foreground text-[11px]">Used by {usedBy}</p>}

      {locked && (
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onReset}>
          <RotateCcw className="size-3" /> Reset to generated
        </Button>
      )}
    </div>
  );
}
