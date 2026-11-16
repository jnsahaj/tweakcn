"use client";

import { useState } from "react";
import { Lock, MoreHorizontal, Pencil, Pipette, Plus, RotateCcw, Trash2 } from "lucide-react";
import ControlSection from "@/components/editor/control-section";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { otherSlugs, refFor } from "../palette";
import { SCALE_STEPS, parseToOklch, toHex } from "../scale";
import type { BrandPalette } from "../types";
import { useBrandPalettes } from "../use-brand-palettes";
import { PaletteForm } from "./palette-form";
import { StepEditor, contrastSummary } from "./step-editor";

/** "Brand palettes" section at the top of the editor's Colors tab. */
export function BrandPalettesSection() {
  const { palettes, add } = useBrandPalettes();
  const [adding, setAdding] = useState(false);

  return (
    <ControlSection
      title="Brand palettes"
      expanded
      headerAction={
        <TooltipWrapper label="Add brand colour" asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAdding(true)}
            className="text-muted-foreground group h-auto px-1.5 py-0.5 text-[11px]"
            aria-label="Add brand colour"
          >
            <Plus className="size-3 transition-all group-hover:scale-110" />
            <span className="tracking-wider uppercase">Add</span>
          </Button>
        </TooltipWrapper>
      }
    >
      <div className="flex flex-col gap-3">
        {palettes.length === 0 && !adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-lg border border-dashed px-3 py-3 text-left text-xs transition-colors"
          >
            <span className="text-foreground font-medium">Add brand colour</span>
            <br />
            Enter a client colour to get a 50–950 scale you can use for any token.
          </button>
        )}

        {palettes.map((p) => (
          <PaletteRow key={p.id} palette={p} palettes={palettes} />
        ))}

        {adding && (
          <PaletteForm
            takenSlugs={otherSlugs(palettes)}
            initialHex=""
            submitLabel="Add brand colour"
            onCancel={() => setAdding(false)}
            onSubmit={(name, hex) => {
              add(name, hex);
              setAdding(false);
            }}
          />
        )}
      </div>
    </ControlSection>
  );
}

function PaletteRow({ palette, palettes }: { palette: BrandPalette; palettes: BrandPalette[] }) {
  const { rename, setBase, setStep, resetStep, resetAll, remove } = useBrandPalettes();
  const [editing, setEditing] = useState<null | "rename" | "base">(null);
  const lockedCount = SCALE_STEPS.filter((s) => palette.steps[s].locked).length;

  return (
    <div className="flex flex-col gap-1.5" data-brand-palette={palette.slug}>
      <div className="flex items-center gap-2">
        <div className="size-4 shrink-0 rounded-sm border" style={{ background: palette.baseHex }} />
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="text-foreground truncate text-[13px] font-medium">{palette.name}</span>
          <span className="text-muted-foreground truncate font-mono text-[11px]">{palette.baseHex}</span>
        </div>
        {lockedCount > 0 && (
          <span className="text-muted-foreground flex items-center gap-0.5 text-[11px]" title="Hand-edited steps">
            <Lock className="size-3" />
            {lockedCount}
          </span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="size-6 p-0" aria-label={`${palette.name} options`}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditing("rename")}>
              <Pencil /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEditing("base")}>
              <Pipette /> Change base colour
            </DropdownMenuItem>
            <DropdownMenuItem disabled={lockedCount === 0} onSelect={() => resetAll(palette.id)}>
              <RotateCcw /> Reset all overrides
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => remove(palette.id)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-11 gap-0.5">
        {SCALE_STEPS.map((step) => {
          const { value, locked } = palette.steps[step];
          const isAnchor = palette.anchorStep === step;
          const isLight = (parseToOklch(value)?.l ?? 0) > 0.6;
          return (
            <Popover key={step}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label={`Edit ${refFor(palette.slug, step)}`}
                  title={`${refFor(palette.slug, step)}\n${toHex(value)}\n${contrastSummary(value)}`}
                  className="group flex min-w-0 flex-col items-center gap-0.5"
                >
                  <span
                    className="group-hover:ring-foreground/50 group-data-[state=open]:ring-foreground relative h-7 w-full rounded-[4px] border ring-2 ring-transparent transition-all"
                    style={{ background: value }}
                  >
                    {(isAnchor || locked) && (
                      <span
                        className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          isLight ? "text-black/70" : "text-white/80"
                        )}
                      >
                        {locked ? <Lock className="size-2.5" /> : <span className="size-1.5 rounded-full bg-current" />}
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground font-mono text-[9px] tabular-nums">{step}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <StepEditor
                  palette={palette}
                  step={step}
                  onChange={(c) => setStep(palette.id, step, c)}
                  onReset={() => resetStep(palette.id, step)}
                />
              </PopoverContent>
            </Popover>
          );
        })}
      </div>

      {editing && (
        <PaletteForm
          takenSlugs={otherSlugs(palettes, palette.id)}
          initialName={palette.name}
          initialHex={palette.baseHex}
          fields={editing === "rename" ? { name: true } : { hex: true }}
          submitLabel={editing === "rename" ? "Rename" : "Update colour"}
          onCancel={() => setEditing(null)}
          onSubmit={(name, hex) => {
            if (editing === "rename") rename(palette.id, name);
            else setBase(palette.id, hex);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
