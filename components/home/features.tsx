import { BrainCircuit, Code, Contrast, FileCode, Gem, Layers, Paintbrush } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    index: "01",
    title: "Color Control",
    description:
      "Customize background, text, and border colors with an intuitive color picker and live OKLCH preview.",
    icon: <Paintbrush className="size-4" />,
  },
  {
    index: "02",
    title: "Typography Settings",
    description: "Fine-tune font family, size, weight, and letter spacing across every scale.",
    icon: <FileCode className="size-4" />,
  },
  {
    index: "03",
    title: "Tailwind v4 & v3",
    description:
      "Seamlessly export to either Tailwind version with full OKLCH and HSL format support.",
    icon: <Code className="size-4" />,
  },
  {
    index: "04",
    title: "Detailed Properties",
    description:
      "Adjust radius, spacing, shadows, and every CSS custom property shadcn/ui exposes.",
    icon: <Layers className="size-4" />,
  },
  {
    index: "05",
    title: "Contrast Checker",
    description:
      "Ensure your palette meets WCAG accessibility standards with built-in contrast ratio analysis.",
    icon: <Contrast className="size-4" />,
  },
  {
    index: "06",
    title: "AI Theme Generation",
    description:
      "Provide an image or text prompt and the AI returns a production-ready shadcn/ui theme instantly.",
    icon: <BrainCircuit className="size-4" />,
    pro: true,
  },
];

export function Features() {
  return (
    <section id="features" className="w-full border-b border-[var(--hp-rule)] bg-[var(--hp-surface)]">
      {/* Section header */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between border-b border-[var(--hp-rule)] py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--hp-accent)]" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--hp-accent)]">
                Capabilities
              </span>
            </span>
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Total control.
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden max-w-xs text-right text-sm leading-relaxed text-[var(--hp-text-secondary)] md:block"
          >
            Every knob shadcn/ui exposes, surfaced in one editor with live preview and instant export.
          </motion.p>
        </div>
      </div>

      {/* Feature grid — editorial table layout */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid divide-y divide-[var(--hp-rule)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="group relative border-b border-[var(--hp-rule)] p-8 transition-colors hover:bg-[var(--hp-surface)] sm:border-r last:border-b-0 sm:last:border-b"
            >
              {/* Index + icon row */}
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--hp-text-secondary)]">
                  {feature.index}
                </span>
                <span className="flex size-8 items-center justify-center border border-[var(--hp-rule)] text-[var(--hp-text-secondary)] transition-colors group-hover:border-[var(--hp-accent)]/40 group-hover:text-[var(--hp-accent)]">
                  {feature.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-2 flex items-center gap-2 font-mono text-base font-semibold text-white">
                {feature.title}
                {feature.pro && (
                  <span className="inline-flex items-center gap-1 border border-[var(--hp-accent)]/40 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--hp-accent)]">
                    <Gem className="size-2.5" />
                    PRO
                  </span>
                )}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[var(--hp-text-secondary)]">
                {feature.description}
              </p>

              {/* Hover accent bar */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-[var(--hp-accent)] transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
