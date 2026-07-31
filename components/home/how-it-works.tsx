import { motion } from "motion/react";

const steps = [
  {
    step: "01",
    title: "Select a Preset",
    description: "Start from one of our professionally crafted theme presets. Pick the palette closest to your vision.",
  },
  {
    step: "02",
    title: "Customize",
    description: "Adjust colors, radius, typography, and spacing visually in real time. Every token is editable.",
  },
  {
    step: "03",
    title: "Export Code",
    description: "Copy the generated CSS variables or Tailwind config directly into your project.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full border-b border-border/60">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header row */}
        <div className="border-b border-border/60 py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <p className="label-eyebrow mb-4">Process</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                Three steps to
                <br />
                <em className="not-italic font-light font-serif text-muted-foreground">perfection.</em>
              </h2>
            </div>
            <p className="text-muted-foreground text-base max-w-xs md:text-right leading-relaxed">
              {"We've"} simplified the theming process so you can focus on building your app, not configuring it.
            </p>
          </motion.div>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 border-b border-border/60">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className={`py-12 px-0 flex flex-col gap-4 ${i < 2 ? "md:border-r border-border/60 md:pr-10" : ""} ${i > 0 ? "md:pl-10" : ""} border-b md:border-b-0 last:border-b-0`}
            >
              <span className="text-[5rem] font-bold leading-none text-border select-none">
                {step.step}
              </span>
              <div className="w-8 h-px bg-primary" />
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
