import { AIChatDemo } from "@/components/examples/ai-chat-demo";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const aiFeatures = [
  "Theme Preview",
  "Checkpoint Restoration",
  "Image Extraction",
  "Text-to-Theme",
];

export function AIGenerationCTA() {
  return (
    <section
      id="ai-generation-cta"
      className="w-full border-b border-[var(--hp-rule)] bg-[var(--hp-surface)]"
    >
      <div className="container mx-auto grid items-center gap-0 px-4 md:px-6 lg:grid-cols-2 lg:divide-x lg:divide-[var(--hp-rule)]">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="py-16 pr-0 lg:pr-16"
        >
          <span className="mb-4 flex items-center gap-3">
            <span className="h-px w-6 bg-[var(--hp-accent)]" />
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--hp-accent)]">
              Pro Feature
            </span>
          </span>

          <h2 className="font-mono text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Generate themes
            <br />
            in seconds.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--hp-text-secondary)] md:text-base">
            Provide an image or text prompt and the AI returns a complete,
            production-ready shadcn/ui theme. No manual tweaking required.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-3">
            {aiFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[var(--hp-text-secondary)]">
                <span className="flex size-4 shrink-0 items-center justify-center border border-[var(--hp-accent)]/40">
                  <Check className="size-2.5 text-[var(--hp-accent)]" />
                </span>
                <span className="font-mono text-xs">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/ai">
              <button className="group inline-flex h-10 items-center gap-2 bg-[var(--hp-accent)] px-6 font-mono text-sm font-semibold text-black transition-colors hover:bg-[var(--hp-accent-dim)]">
                Generate with AI
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="inline-flex h-10 items-center border border-[var(--hp-rule)] px-6 font-mono text-sm text-[var(--hp-text-secondary)] transition-colors hover:border-white/30 hover:text-white">
                View Pricing
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Right — demo */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="hidden py-16 pl-0 lg:block lg:pl-16"
        >
          <div className="border border-[var(--hp-rule)] bg-[var(--hp-surface-raised)] overflow-hidden">
            {/* Fake window chrome */}
            <div className="flex items-center gap-1.5 border-b border-[var(--hp-rule)] px-4 py-3">
              <span className="size-2.5 rounded-full bg-[var(--hp-rule)]" />
              <span className="size-2.5 rounded-full bg-[var(--hp-rule)]" />
              <span className="size-2.5 rounded-full bg-[var(--hp-rule)]" />
              <span className="ml-3 font-mono text-[10px] text-[var(--hp-text-secondary)]">
                AI Theme Generator — tweakcn Pro
              </span>
            </div>
            <div className="h-[480px] p-4">
              <AIChatDemo disabled={false} className="h-full pb-0 bg-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
