import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, Code, Contrast, FileCode, Gem, Layers, Paintbrush } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Color Control",
    description:
      "Customize background, text, and border colors with an intuitive color picker interface. We even integrate with the latest Tailwind v4 color palette.",
    icon: <Paintbrush className="size-5" />,
  },
  {
    title: "Typography Settings",
    description: "Fine-tune font size, weight, and text transform to create the perfect look.",
    icon: <FileCode className="size-5" />,
  },
  {
    title: "Tailwind v4 & v3 Support",
    description:
      "Seamlessly switch between Tailwind v4 and v3, with support for multiple color formats including OKLCH & HSL.",
    icon: <Code className="size-5" />,
  },
  {
    title: "Tailwind Properties",
    description:
      "Fine-tune every aspect of your components with precise control over radius, spacing, shadows, and other Tailwind properties.",
    icon: <Layers className="size-5" />,
  },
  {
    title: "Contrast Checker",
    description:
      "Ensure your designs meet accessibility standards with built-in contrast ratio checking between text and background colors.",
    icon: <Contrast className="size-5" />,
  },
  {
    title: "AI Theme Generation",
    description:
      "Create stunning, ready-to-use themes in seconds. Just provide an image or a text prompt, and our AI does the rest.",
    icon: <BrainCircuit className="size-5" />,
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
            variant="secondary"
          >
            <span className="text-primary mr-1">✦</span> Features
          </Badge>

          <h2 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Powerful Customization Tools
          </h2>
          <p className="text-muted-foreground max-w-[800px] md:text-lg">
            All the tools you need to customize your shadcn/ui components and make them unique.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-border/40 from-card to-card/50 hover:border-primary/20 group h-full overflow-hidden bg-gradient-to-b backdrop-blur transition-all hover:shadow-lg">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-4 flex size-12 items-center justify-center rounded-full transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 flex items-center gap-2 text-xl font-bold">
                    {feature.title}
                    {feature.pro && (
                      <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold">
                        <Gem className="size-3" />
                        Pro
                      </span>
                    )}
                  </h3>
                  <p className="text-muted-foreground text-pretty">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
