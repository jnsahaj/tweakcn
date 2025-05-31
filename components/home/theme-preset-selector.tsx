"use client";

import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/store/editor-store";
import { defaultPresets } from "@/utils/theme-presets";
import { motion } from "motion/react";

import { ThemePresetButtons } from "@/components/home/theme-preset-buttons";
import { lazy, Suspense } from "react";
import { GithubCard } from "../examples/cards/github-card";
import { CardsStats } from "../examples/cards/stats";
import { Loading } from "../loading";

const DemoMail = lazy(() => import("@/components/examples/mail"));

export function ThemePresetSelector() {
  const { themeState, applyThemePreset } = useEditorStore();
  const mode = themeState.currentMode;
  const presetNames = Object.keys(defaultPresets);

  return (
    <section id="examples" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <Badge
              className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
              variant="secondary"
            >
              <span className="text-primary mr-1">✦</span> Theme Presets
            </Badge>
          </div>
          <h2 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Elevate Your Design Instantly
          </h2>
          <p className="text-muted-foreground max-w-[800px] md:text-lg">
            Apply theme presets with a single click. See how each option enhances the look.
          </p>
        </motion.div>

        {/* Theme Selector Buttons */}
        <ThemePresetButtons
          presetNames={presetNames}
          mode={mode}
          themeState={themeState}
          applyThemePreset={applyThemePreset}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="from-card/50 to-card/30 @container relative max-h-[60vh] overflow-hidden rounded-lg border bg-gradient-to-b shadow-lg backdrop-blur-sm md:max-h-[70vh]"
        >
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-16"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0), var(--background))",
            }}
          />
          <Suspense fallback={<Loading />}>
            <div className="hidden lg:block">
              <DemoMail />
            </div>

            <div className="flex flex-col gap-4 p-4 lg:hidden">
              <CardsStats />
              <GithubCard />
            </div>
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
