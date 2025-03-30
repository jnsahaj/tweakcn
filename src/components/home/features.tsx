import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import {
  Code,
  FileCode,
  Layers,
  Palette,
  Paintbrush,
  PaintBucket,
} from "lucide-react";

const features = [
  {
    title: "Visual Theme Customizer",
    description:
      "Customize your shadcn/ui components with a real-time preview to see changes instantly.",
    icon: <Palette className="size-5" />,
  },
  {
    title: "Color Control",
    description:
      "Customize background, text, and border colors with an intuitive color picker interface.",
    icon: <Paintbrush className="size-5" />,
  },
  {
    title: "Typography Settings",
    description:
      "Fine-tune font size, weight, and text transform to create the perfect look.",
    icon: <FileCode className="size-5" />,
  },
  {
    title: "Tailwind v4 & v3 Support",
    description:
      "Seamlessly switch between Tailwind v4 and v3, with support for multiple color formats including OKLCH & HSL.",
    icon: <Code className="size-5" />,
  },
  {
    title: "Dimension Control",
    description:
      "Adjust padding, border radius, and other dimensions to match your design system.",
    icon: <Layers className="size-5" />,
  },
  {
    title: "Beautiful Theme Presets",
    description:
      "Choose from stunning pre-designed themes and customize both light and dark mode colors effortlessly.",
    icon: <PaintBucket className="size-5" />,
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
    <section id="features" className="w-full py-20 md:py-32 relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.03),transparent_70%)]"></div>
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm"
            variant="secondary"
          >
            <span className="mr-1 text-primary">✦</span> Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Powerful Customization Tools
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            tweakcn provides all the tools you need to customize your shadcn/ui
            components and make them unique.
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
              <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-card to-card/50 backdrop-blur transition-all hover:shadow-lg hover:border-primary/20 group">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
