"use client";

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
    <section className="relative w-full overflow-hidden border-b border-[var(--hp-rule)] bg-[var(--hp-surface)]">
      {/* Fine dot grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.28 0 0) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 50%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 50%, transparent 100%)",
        }}
      />

      {/* Hero content */}
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-0 md:pt-32">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-[var(--hp-accent)]" />
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--hp-accent)]">
            Theme Editor for shadcn/ui
          </span>
        </motion.div>

        {/* Headline */}
        <div className="max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-mono text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Design your
            <br />
            <span className="text-[var(--hp-accent)]">perfect</span> theme.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--hp-text-secondary)] md:text-lg"
          >
            Customize colors, typography, and radius with a live preview.
            Export Tailwind v3 or v4 CSS. No sign-up required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.26 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/editor/theme">
              <button className="group inline-flex h-11 items-center gap-2 bg-[var(--hp-accent)] px-6 font-mono text-sm font-semibold text-black transition-colors hover:bg-[var(--hp-accent-dim)]">
                Start Customizing
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
            <Link href="/community">
              <button className="inline-flex h-11 items-center gap-2 border border-[var(--hp-rule)] px-6 font-mono text-sm text-[var(--hp-text-secondary)] transition-colors hover:border-white/30 hover:text-white">
                Browse Community
              </button>
            </Link>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="mt-10 flex flex-wrap items-center gap-6 border-t border-[var(--hp-rule)] pt-8 text-xs font-mono text-[var(--hp-text-secondary)]"
          >
            <span>Free core · Open source</span>
            <span className="h-3 w-px bg-[var(--hp-rule)]" />
            <span>Tailwind v3 &amp; v4</span>
            <span className="h-3 w-px bg-[var(--hp-rule)]" />
            <span>OKLCH &amp; HSL</span>
            <span className="h-3 w-px bg-[var(--hp-rule)]" />
            <span>AI generation</span>
          </motion.div>
        </div>
      </div>

      {/* Preset showcase ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 w-full border-t border-[var(--hp-rule)] bg-[var(--hp-surface)] py-6"
      >
        <ThemePresetButtons
          presetNames={presetNames}
          mode={mode}
          themeState={themeState}
          applyThemePreset={applyThemePreset}
        />
      </motion.div>
    </section>
  );
}
