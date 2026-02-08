"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
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
    <section className="relative isolate w-full overflow-hidden bg-background pt-20 pb-32 md:pt-32 md:pb-40">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>


      <div className="container relative z-20 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Design Your <span className="font-serif italic font-light text-foreground">Perfect</span>{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-1 rounded-lg bg-primary/10 blur-xl opacity-50"></span>
              <span className="relative text-primary inline-flex items-center gap-2">
                shadcn/ui
              </span>
            </span>{" "}
            Theme
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed"
          >
            Customize colors, typography, and layouts with a real-time preview. No signup
            required.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/editor/theme">
              <Button
                size="lg"
                className="h-12 min-w-[180px] rounded-full px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
              >
                Start Customizing
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <a href="/community">
              <Button
                size="lg"
                variant="outline"
                className="h-12 min-w-[180px] rounded-full border-primary/20 bg-background/50 px-8 text-base backdrop-blur-sm transition-all hover:bg-accent/50 hover:border-primary/50"
              >
                View Examples
              </Button>
            </a>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-1">
                <Check className="size-3 text-primary" />
              </div>
              <span>Real-time Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-1">
                <Check className="size-3 text-primary" />
              </div>
              <span>Export to Tailwind</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-1">
                <Check className="size-3 text-primary" />
              </div>
              <span>Beautiful Presets</span>
            </div>
          </motion.div>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 w-full max-w-[100vw] overflow-hidden"
          >
            <div className="relative py-1">
              {/* Gradient Masks for Carousel */}
              <div className="absolute left-0 top-0 bottom-0 z-10 w-20 md:w-40 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 z-10 w-20 md:w-40 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>

              <ThemePresetButtons
                presetNames={presetNames}
                mode={mode}
                themeState={themeState}
                applyThemePreset={applyThemePreset}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
