"use client";

import { Check } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { refFor } from "../palette";
import { SCALE_STEPS } from "../scale";
import type { BrandRef } from "../types";
import { useBrandPalettes } from "../use-brand-palettes";

type BrandGroupProps = {
  /** The token's live reference, if any. */
  activeRef?: BrandRef;
  /** Selected-state fallback for pickers that can't link (e.g. shadow colour). */
  isColorSelected: (value: string) => boolean;
  onSelect: (ref: BrandRef, value: string) => void;
};

function Swatch({ color, selected, className }: { color: string; selected: boolean; className?: string }) {
  return (
    <span
      className={cn("block size-6 shrink-0 rounded-md border", selected && "ring-2 ring-(--color)", className)}
      style={{ background: color, "--color": color } as React.CSSProperties}
    />
  );
}

/** "Brand" groups for the list view of tweakcn's colour popover (one group per palette). */
export function BrandListGroups({ activeRef, isColorSelected, onSelect }: BrandGroupProps) {
  const { palettes } = useBrandPalettes();
  return (
    <>
      {palettes.map((p) => (
        <CommandGroup heading={`Brand · ${p.name}`} key={p.id}>
          {SCALE_STEPS.map((step) => {
            const ref = refFor(p.slug, step);
            const { value } = p.steps[step];
            const selected = activeRef ? activeRef === ref : isColorSelected(value);
            return (
              <CommandItem
                key={ref}
                value={ref}
                keywords={["brand", p.name]}
                onSelect={() => onSelect(ref, value)}
                className="flex items-center gap-2"
              >
                <Swatch color={value} selected={selected} />
                <span>{ref}</span>
                {selected && <Check className="ml-auto size-4 opacity-70" />}
              </CommandItem>
            );
          })}
        </CommandGroup>
      ))}
    </>
  );
}

/** Brand rows for the grid view of tweakcn's colour popover. */
export function BrandSwatchRows({ activeRef, isColorSelected, onSelect }: BrandGroupProps) {
  const { palettes } = useBrandPalettes();
  if (palettes.length === 0) return null;
  return (
    <div className="mb-1 flex flex-col gap-0.5 border-b pb-1">
      <span className="text-muted-foreground px-0.5 text-[11px] font-medium">Brand</span>
      {palettes.map((p) => (
        <div key={p.id} className="flex gap-0.5">
          {SCALE_STEPS.map((step) => {
            const ref = refFor(p.slug, step);
            const { value } = p.steps[step];
            const selected = activeRef ? activeRef === ref : isColorSelected(value);
            return (
              <button
                key={ref}
                type="button"
                title={ref}
                aria-label={`Select color ${ref}`}
                onClick={() => onSelect(ref, value)}
                className="group relative cursor-pointer transition-all hover:z-10 hover:scale-110 hover:shadow-lg"
              >
                <Swatch color={value} selected={selected} className="rounded-none" />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
