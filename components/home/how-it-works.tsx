import { motion } from "motion/react";

const steps = [
  {
    step: "01",
    title: "Select a Preset",
    description:
      "Start from one of the curated built-in themes or load a community theme as your baseline.",
  },
  {
    step: "02",
    title: "Customize Visually",
    description:
      "Adjust every color token, border radius, font family, shadow, and spacing value with a live component preview.",
  },
  {
    step: "03",
    title: "Export Code",
    description:
      "Copy the generated Tailwind CSS variables and paste directly into your project. Supports v3 and v4.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full border-b border-[var(--hp-rule)]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header row */}
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
                How it works
              </span>
            </span>
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
              Three steps.
            </h2>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid divide-y divide-[var(--hp-rule)] md:grid-cols-3 md:divide-x md:divide-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group relative py-12 px-0 md:px-8 first:pl-0 last:pr-0"
            >
              {/* Step number — editorial oversized */}
              <span className="mb-6 block font-mono text-7xl font-bold leading-none text-[var(--hp-rule)] transition-colors duration-300 group-hover:text-[var(--hp-accent)]/20 md:text-8xl">
                {step.step}
              </span>

              {/* Accent underline */}
              <div className="mb-5 h-px w-8 bg-[var(--hp-accent)]" />

              <h3 className="mb-3 font-mono text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--hp-text-secondary)]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
