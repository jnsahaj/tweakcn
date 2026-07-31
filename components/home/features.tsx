import { BrainCircuit, Code, Contrast, FileCode, Gem, Layers, Paintbrush } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Color Control",
    description:
      "Customize background, text, and border colors with an intuitive color picker interface.",
    icon: <Paintbrush className="size-5" />,
    index: "01",
  },
  {
    title: "Typography Settings",
    description: "Fine-tune font size, weight, and text transform to create the perfect look.",
    icon: <FileCode className="size-5" />,
    index: "02",
  },
  {
    title: "Tailwind v4 & v3",
    description:
      "Seamlessly switch between Tailwind versions with support for OKLCH & HSL formats.",
    icon: <Code className="size-5" />,
    index: "03",
  },
  {
    title: "Detailed Properties",
    description:
      "Fine-tune every aspect including radius, spacing, shadows, and other properties.",
    icon: <Layers className="size-5" />,
    index: "04",
  },
  {
    title: "Contrast Checker",
    description:
      "Ensure designs meet accessibility standards with built-in contrast ratio checking.",
    icon: <Contrast className="size-5" />,
    index: "05",
  },
  {
    title: "AI Theme Generation",
    description:
      "Create stunning, ready-to-use themes in seconds. Just provide an image or prompt.",
    icon: <BrainCircuit className="size-5" />,
    pro: true,
    index: "06",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full border-b border-border/60">
      <div className="container mx-auto px-4 md:px-6">

        {/* Section header row */}
        <div className="grid lg:grid-cols-[1fr_2fr] border-b border-border/60">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="py-16 pr-0 lg:pr-16 border-r-0 lg:border-r border-border/60 flex flex-col justify-end"
          >
            <p className="label-eyebrow mb-4">Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Powerful tools.
              <br />
              <span className="text-muted-foreground font-light">Total control.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="py-16 pl-0 lg:pl-16 flex items-end"
          >
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
              Everything you need to customize your shadcn/ui components and make them uniquely yours — from micro-level token control to full theme generation.
            </p>
          </motion.div>
        </div>

        {/* Feature grid - table-style rows */}
        <div>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <div className="grid grid-cols-[auto_1fr_1fr] md:grid-cols-[64px_1fr_2fr_auto] items-center gap-0 border-b border-border/40 py-6 group hover:bg-muted/20 transition-colors px-0 cursor-default">
                {/* Index */}
                <span className="hidden md:block text-xs text-muted-foreground/50 font-mono w-16 flex-shrink-0">
                  {feature.index}
                </span>

                {/* Icon + Title */}
                <div className="flex items-center gap-4 col-span-1">
                  <div className="flex size-9 items-center justify-center rounded-sm bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{feature.title}</h3>
                    {feature.pro && (
                      <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        <Gem className="size-2.5" />
                        Pro
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="hidden md:block text-sm text-muted-foreground col-span-1 pl-8 pr-4">{feature.description}</p>

                {/* Arrow */}
                <span className="hidden md:block text-muted-foreground/30 group-hover:text-muted-foreground transition-colors text-lg pr-2">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
