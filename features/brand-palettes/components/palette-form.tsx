"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { slugify, validatePaletteName } from "../naming";
import { toHex } from "../scale";

type PaletteFormProps = {
  /** Slugs of the other palettes, for clash validation. */
  takenSlugs: string[];
  initialName?: string;
  initialHex?: string;
  /** Which fields to show. */
  fields?: { name?: boolean; hex?: boolean };
  submitLabel: string;
  onSubmit: (name: string, hex: string) => void;
  onCancel?: () => void;
};

/** Inline form for "Add brand colour", rename and change base colour. */
export function PaletteForm({
  takenSlugs,
  initialName = "",
  initialHex = "#0B3D2E",
  fields = { name: true, hex: true },
  submitLabel,
  onSubmit,
  onCancel,
}: PaletteFormProps) {
  const [name, setName] = useState(initialName);
  const [hexInput, setHexInput] = useState(initialHex);
  const [touched, setTouched] = useState(false);

  const hex = toHex(hexInput);
  const nameError = fields.name ? validatePaletteName(name, takenSlugs) : null;
  const hexError = fields.hex && !hex ? "Enter a colour, e.g. #0B3D2E." : null;
  const canSubmit = !nameError && !hexError;
  const slug = slugify(name);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit(name.trim(), (hex ?? initialHex).toUpperCase());
  };

  return (
    <form onSubmit={submit} className="bg-muted/30 flex flex-col gap-2 rounded-lg border p-2">
      {fields.name && (
        <div className="flex flex-col gap-1">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name && setTouched(true)}
            placeholder="Colour name, e.g. Forest Green"
            aria-label="Brand colour name"
            aria-invalid={touched && !!nameError}
            className="bg-background text-foreground focus:border-ring aria-invalid:border-destructive h-7 w-full min-w-0 rounded border px-2 text-xs outline-none"
          />
          {touched && nameError ? (
            <p className="text-destructive text-[11px]">{nameError}</p>
          ) : (
            slug && <p className="text-muted-foreground font-mono text-[11px]">{slug}-50 … {slug}-950</p>
          )}
        </div>
      )}
      {fields.hex && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div
              className="relative size-7 shrink-0 overflow-hidden rounded-md border shadow-sm"
              style={{ backgroundColor: hex ?? "transparent" }}
            >
              <input
                type="color"
                value={hex ?? "#000000"}
                onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                aria-label="Pick brand colour"
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
            </div>
            <input
              autoFocus={!fields.name}
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              placeholder="#0B3D2E"
              aria-label="Brand colour hex"
              aria-invalid={touched && !!hexError}
              className="bg-background text-foreground focus:border-ring aria-invalid:border-destructive h-7 w-full min-w-0 rounded border px-2 font-mono text-xs outline-none"
            />
          </div>
          {touched && hexError && <p className="text-destructive text-[11px]">{hexError}</p>}
        </div>
      )}
      <div className="flex justify-end gap-1">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          className={cn("h-7 px-2 text-xs", !canSubmit && touched && "opacity-50")}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
