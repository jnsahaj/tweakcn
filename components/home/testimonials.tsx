import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import man1 from "@/assets/man1.png";
import man2 from "@/assets/man2.png";
import girl1 from "@/assets/girl1.png";
import girl2 from "@/assets/girl2.png";
import girl3 from "@/assets/girl3.png";

const testimonials = [
  {
    image: man1.src,
    name: "Sanwal Sulehri",
    tag: "sanwalakram12",
    description: `Playing around with @tweakcn suddenly made me feel inspired to launch that side project.`,
  },
  {
    image: man2.src,
    name: "Darius Flynn",
    tag: "flynnn",
    description: `Exploring @tweakcn's sleek UI. It's like a dark mode enthusiast's playground. Simply incredible stuff.`,
  },
  {
    name: "Suna Martinez",
    tag: "sunacode",
    description: `@tweakcn is not messing around with its component library game.`,
  },
  {
    image: girl1.src,
    name: "Olivia Blackwood",
    tag: "olivia1992",
    description: `@tweakcn is slick. That globe graphic though. Making me feel like I'm building websites for a sci-fi movie.`,
  },
  {
    image: girl2.src,
    name: "Esme Rothschild",
    tag: "EmeRothArt",
    description: `Just made my first website with @tweakcn. Its flexibility is speaking my language. No drama, just seamless integration.`,
  },
  {
    image: girl3.src,
    name: "Kai Nakamura",
    tag: "KaiNakWaves",
    description: `@tweakcn is a game-changer for rapid prototyping. The components are so well thought out.`,
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

const _itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Testimonials() {
  return (
    <section id="testimonials" className="relative isolate w-full py-20 md:py-32">
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
            <span className="text-primary mr-1">✦</span> Testimonials
          </Badge>
          <h2 className="from-foreground to-foreground/80 max-w-[600px] bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Loved by designers and developers across the planet
          </h2>
          <p className="text-muted-foreground max-w-[500px] md:text-lg">
            Here&apos;s what people are saying about tweakcn
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={_itemVariant}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-border/40 from-card to-card/50 hover:border-primary/20 group h-full overflow-hidden bg-gradient-to-b backdrop-blur transition-all hover:shadow-lg">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center gap-3">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-foreground text-xl font-semibold">{testimonial.name}</h3>
                      <p className="text-muted-foreground text-sm">@{testimonial.tag}</p>
                    </div>
                  </div>
                  <p className="text-foreground">{testimonial.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
