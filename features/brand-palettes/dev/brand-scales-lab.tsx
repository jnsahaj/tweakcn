"use client";

import { useMemo, useState } from "react";
import { differenceEuclidean, formatHex, parse, wcagContrast } from "culori";
import { TAILWIND_PALETTE } from "@/utils/registry/tailwind-colors";
import { SCALE_STEPS, generateScale, parseToOklch, toHex, type ScaleStep } from "../scale";

const SAMPLES: { hex: string; label: string; compare: keyof typeof TAILWIND_PALETTE }[] = [
  { hex: "#0B3D2E", label: "Dark green", compare: "emerald" },
  { hex: "#FF6B1A", label: "Bright orange", compare: "orange" },
  { hex: "#1D4ED8", label: "Saturated blue", compare: "blue" },
  { hex: "#F5E6A8", label: "Pale yellow", compare: "yellow" },
  { hex: "#1A1A1A", label: "Near-black", compare: "neutral" },
];

const deltaE = differenceEuclidean("oklab");

type Row = { values: Record<ScaleStep, string>; anchor?: ScaleStep };

function ScaleRow({ title, subtitle, row }: { title: string; subtitle: string; row: Row }) {
  const lightness = SCALE_STEPS.map((s) => parseToOklch(row.values[s])?.l ?? 0);
  const steps = SCALE_STEPS.map((s, i) =>
    i === 0 ? null : deltaE(parse(row.values[SCALE_STEPS[i - 1]])!, parse(row.values[s])!)
  );
  return (
    <div className="grid grid-cols-[10rem_1fr] items-start gap-3">
      <div className="pt-2">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-muted-foreground font-mono text-xs">{subtitle}</div>
      </div>
      <div className="grid grid-cols-11 gap-1">
        {SCALE_STEPS.map((step, i) => {
          const value = row.values[step];
          const o = parseToOklch(value)!;
          const onWhite = wcagContrast(value, "#ffffff");
          const isAnchor = row.anchor === step;
          return (
            <div key={step} className="flex flex-col gap-1">
              <div
                className="relative h-14 rounded-md border"
                style={{ background: value }}
                title={`${value}\n${formatHex(parse(value))}\nvs white ${onWhite.toFixed(2)} · vs black ${wcagContrast(value, "#000000").toFixed(2)}`}
              >
                {isAnchor && (
                  <span
                    className="absolute top-1 right-1 size-2 rounded-full ring-2 ring-white"
                    style={{ background: o.l > 0.6 ? "#000" : "#fff" }}
                    aria-label="anchor"
                  />
                )}
              </div>
              <div className="font-mono text-[10px] leading-tight">
                <div className="font-semibold">
                  {step}
                  {isAnchor ? " ●" : ""}
                </div>
                <div>{toHex(value)}</div>
                <div className="text-muted-foreground">L {lightness[i].toFixed(3)}</div>
                <div className="text-muted-foreground">C {(o.c ?? 0).toFixed(3)}</div>
                <div className="text-muted-foreground">
                  {steps[i] === null ? "ΔE –" : `ΔE ${steps[i]!.toFixed(3)}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BrandScalesLab() {
  const [custom, setCustom] = useState("#7C3AED");
  const customScale = useMemo(() => {
    try {
      return generateScale(custom);
    } catch {
      return null;
    }
  }, [custom]);

  return (
    <div className="bg-background text-foreground mx-auto max-w-6xl space-y-10 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Brand scales lab</h1>
        <p className="text-muted-foreground max-w-3xl text-sm">
          Dev-only. Each sample brand colour (top row) is shown above the closest Tailwind v4 scale (bottom row). The ●
          marks the anchor step, which holds the brand hex exactly. L = OKLCH lightness, C = chroma, ΔE = perceptual
          distance from the previous step (even ΔE ≈ evenly stepped). Hover a swatch for contrast vs white/black.
        </p>
      </header>

      {SAMPLES.map((s) => {
        const generated = generateScale(s.hex);
        const tw = TAILWIND_PALETTE[s.compare] as Record<ScaleStep, string>;
        return (
          <section key={s.hex} className="space-y-3">
            <ScaleRow title={s.label} subtitle={s.hex} row={{ values: generated.steps, anchor: generated.anchorStep }} />
            <ScaleRow title={`Tailwind ${s.compare}`} subtitle="reference" row={{ values: tw }} />
          </section>
        );
      })}

      <section className="space-y-3 border-t pt-8">
        <label className="flex items-center gap-3 text-sm">
          <span className="font-medium">Try any colour</span>
          <input
            type="color"
            value={toHex(custom) ?? "#000000"}
            onChange={(e) => setCustom(e.target.value)}
            className="size-8 cursor-pointer"
          />
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="bg-muted/50 h-8 w-40 rounded border px-2 font-mono text-xs"
          />
        </label>
        {customScale ? (
          <ScaleRow title="Custom" subtitle={custom} row={{ values: customScale.steps, anchor: customScale.anchorStep }} />
        ) : (
          <p className="text-destructive text-sm">Not a valid colour.</p>
        )}
      </section>
    </div>
  );
}
