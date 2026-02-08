import { BrainCircuit, Code, Contrast, FileCode, Gem, Layers, Paintbrush } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Color Control",
    description:
      "Customize background, text, and border colors with an intuitive color picker interface.",
    icon: <Paintbrush className="size-6" />,
  },
  {
    title: "Typography Settings",
    description: "Fine-tune font size, weight, and text transform to create the perfect look.",
    icon: <FileCode className="size-6" />,
  },
  {
    title: "Tailwind v4 & v3",
    description:
      "Seamlessly switch between Tailwind versions with support for OKLCH & HSL formats.",
    icon: <Code className="size-6" />,
  },
  {
    title: "Detailed Properties",
    description:
      "Fine-tune every aspect including radius, spacing, shadows, and other properties.",
    icon: <Layers className="size-6" />,
  },
  {
    title: "Contrast Checker",
    description:
      "Ensure designs meet accessibility standards with built-in contrast ratio checking.",
    icon: <Contrast className="size-6" />,
  },
  {
    title: "AI Theme Generation",
    description:
      "Create stunning, ready-to-use themes in seconds. Just provide an image or prompt.",
    icon: <BrainCircuit className="size-6" />,
    pro: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="relative isolate w-full py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(from_var(--primary)_r_g_b_/_0.03),transparent_70%)]"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-left">
              Powerful Tools <br className="hidden lg:block" />
              <span className="text-muted-foreground">For Total Control</span>
            </h2>
            <p className="text-muted-foreground max-w-[400px] text-lg">
              Everything you need to customize your shadcn/ui components and make them unique.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="group h-full rounded-2xl border border-border/40 bg-card/50 p-6 transition-all hover:bg-card hover:shadow-lg">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 flex items-center gap-2 text-xl font-bold">
                      {feature.title}
                      {feature.pro && (
                        <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
                          <Gem className="size-3" />
                          Pro
                        </span>
                      )}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
