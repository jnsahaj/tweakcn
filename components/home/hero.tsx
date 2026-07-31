"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEditorStore } from "@/store/editor-store";
import { defaultPresets } from "@/utils/theme-presets";
import { ThemePresetButtons } from "@/components/home/theme-preset-buttons";

const presetNames = Object.keys(defaultPresets);

export function Hero() {
  const { themeState, applyThemePreset } = useEditorStore();
  const mode = themeState.currentMode;

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Subtle grid background */}
      <div className="absolute inset-0 -z-10 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:64px_64px] opacity-40" />

      {/* Top rule */}
      <div className="w-full border-b border-border/60" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Two-column hero layout */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-0 items-start border-b border-border/60">

          {/* Left: headline block */}
          <div className="py-16 md:py-24 pr-0 lg:pr-16 border-r-0 lg:border-r border-border/60">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="label-eyebrow mb-6"
            >
              Visual Theme Editor for shadcn/ui
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-3xl text-[clamp(2.5rem,6vw,5.5rem)] font-bold tracking-tight leading-[1.05] text-balance"
            >
              Design your
              <br />
              <em className="not-italic font-light font-serif text-foreground/60">perfect</em>{" "}
              shadcn/ui
              <br />
              <span className="text-primary">theme.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed"
            >
              Customize colors, typography, and spacing with a real-time preview. Export to Tailwind v3 or v4. No signup required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex items-center gap-3"
            >
              <Link href="/editor/theme">
                <Button
                  size="lg"
                  className="h-11 px-6 rounded-sm text-sm font-medium"
                >
                  Start Customizing
                  <ArrowRight className="ml-2 size-3.5" />
                </Button>
              </Link>
              <Link href="/community">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 rounded-sm text-sm font-medium border-border/80"
                >
                  Browse Themes
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: stats sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden lg:flex flex-col justify-end py-16 md:py-24 pl-16 gap-10 min-w-[200px]"
          >
            <div>
              <p className="text-4xl font-bold tracking-tight">100+</p>
              <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">Theme Presets</p>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight">Free</p>
              <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">Core Features</p>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight">v4</p>
              <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">Tailwind Support</p>
            </div>
          </motion.div>
        </div>

        {/* Preset carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="py-10 border-b border-border/60"
        >
          <p className="label-eyebrow mb-6 pl-0">Live theme presets — click to apply</p>
          <div className="relative w-full max-w-[100vw] overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            <ThemePresetButtons
              presetNames={presetNames}
              mode={mode}
              themeState={themeState}
              applyThemePreset={applyThemePreset}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
