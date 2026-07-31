import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="w-full border-b border-[var(--hp-rule)] bg-[var(--hp-surface)]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-start gap-8 py-20 md:flex-row md:items-end md:justify-between md:py-24"
        >
          {/* Left */}
          <div className="max-w-xl">
            <span className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--hp-accent)]" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--hp-accent)]">
                Get started
              </span>
            </span>
            <h2 className="font-mono text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Make your components
              <br />
              <span className="text-[var(--hp-accent)]">stand out.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--hp-text-secondary)] md:text-base">
              Open the editor — no sign-up, no friction. Free forever for core features.
            </p>
          </div>

          {/* Right — actions */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center md:flex-col md:items-end lg:flex-row">
            <Link href="/editor/theme">
              <button className="group inline-flex h-12 items-center gap-2 bg-[var(--hp-accent)] px-8 font-mono text-sm font-semibold text-black transition-colors hover:bg-[var(--hp-accent-dim)]">
                Open Editor
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
            <a
              href="https://github.com/jnsahaj/tweakcn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="inline-flex h-12 items-center border border-[var(--hp-rule)] px-8 font-mono text-sm text-[var(--hp-text-secondary)] transition-colors hover:border-white/30 hover:text-white">
                View on GitHub
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
