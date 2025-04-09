import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

const steps = [
  {
    step: "01",
    title: "Select Theme Preset",
    description: "Choose the theme you want to customize from our growing library.",
  },
  {
    step: "02",
    title: "Customize Visually",
    description:
      "Use our intuitive interface to adjust colors, dimensions, typography, and other properties.",
  },
  {
    step: "03",
    title: "Copy Code",
    description: "Copy the generated Tailwind CSS code directly into your project.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-background"></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(var(--muted-rgb),0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--muted-rgb),0.05)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>

      <div className="container px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
            variant="secondary"
          >
            <span className="mr-1 text-primary">✦</span> How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Simple Process, Beautiful Results
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Customize your shadcn/ui components in just a few simple steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center space-y-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg relative">
                {step.step}
                <div
                  className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75"
                  style={{
                    animationDuration: "3s",
                    animationDelay: `${i * 0.5}s`,
                  }}
                ></div>
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
