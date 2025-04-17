import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { Folder, Grid, Layers, Palette, Repeat, Users } from "lucide-react";

const roadmapItems = [
  {
    title: "Global Theme Editor",
    description:
      "Create and manage complete themes with presets for your entire application.",
    status: "In Progress",
    icon: <Palette className="size-5" />,
  },
  {
    title: "Theme Import/Export",
    description: "Save and share your custom themes with others.",
    status: "In Progress",
    icon: <Repeat className="size-5" />,
  },
  {
    title: "More Controls",
    description:
      "Support for more controls, including Spacing, Shadows, Tracking and more",
    status: "Coming Soon",
    icon: <Layers className="size-5" />,
  },
  {
    title: "Community Themes",
    description: "Allow users to submit themes, vote on the best designs",
    status: "Planned",
    icon: <Users className="size-5" />,
  },
  {
    title: "Multi-Project Management",
    description:
      "Save and manage multiple theme projects, making it easy to switch between designs.",
    status: "Planned",
    icon: <Folder className="size-5" />,
  },
  {
    title: "More Presets",
    description:
      "Expand the preset library with a wider variety of stunning themes for quick customization.",
    status: "Planned",
    icon: <Grid className="size-5" />,
  },
];

export function Roadmap() {
  return (
    <section
      id="roadmap"
      className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-background/20"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(var(--secondary-rgb),0.05),transparent_50%)]"></div>

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
            <span className="mr-1 text-primary">✦</span> Roadmap
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            What&apos;s Coming Next
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            We&apos;re constantly working to improve tweakcn and add new
            features. Here&apos;s what&apos;s on our roadmap.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roadmapItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-card to-card/50 backdrop-blur transition-all hover:shadow-lg hover:border-primary/20">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <Badge
                      variant={
                        item.status === "In Progress"
                          ? "default"
                          : item.status === "Coming Soon"
                          ? "secondary"
                          : "outline"
                      }
                      className="shadow-sm"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
