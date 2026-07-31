"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Testimonials Data
const testimonials = [
  {
    image: "https://pbs.twimg.com/profile_images/1766632098461253634/2t4wT1TZ_400x400.png",
    name: "YiMing",
    tag: "yimingdothan",
    description: `v0 + tweakcn + chatgpt for graphics

generated a landing page in about 2~ hours

crazy how easy this shit is now`,
    href: "https://x.com/yimingdothan/status/1923833970799608086",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg",
    name: "Guillermo Rauch",
    tag: "rauchg",
    description: `If you're looking to learn:
▪️ full stack Next.js
▪️ how to build a focused product people love

… look no further than tweakcn by 
@iamsahaj_xyz. It's an open-source @shadcn theme builder.
`,
    href: "https://x.com/rauchg/status/1938745259204493738",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    name: "shadcn",
    tag: "shadcn",
    description: `4/n - Finally, a custom theme from tweakcn by @iamsahaj_xyz`,
    href: "https://x.com/shadcn/status/1909619407124676701",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1849574174785732608/ltlLcyaT_400x400.jpg",
    name: "Kevin Kern",
    tag: "kregenrek",
    description: `Tweakcn is really cool. Custom shadcn themes on the fly.`,
    href: "https://x.com/kregenrek/status/1911892242568216618",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1756766826736893952/6Gvg6jha_400x400.jpg",
    name: "OrcDev",
    tag: "theorcdev",
    description: `Transform your Shadcn app with one click!

@iamsahaj_xyz created a great concept with Tweakcn ⚔️`,
    href: "https://x.com/theorcdev/status/1923396394452124081",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1934209156816216064/NZns8Qth_400x400.jpg",
    name: "Ciara Wearen",
    tag: "nocheerleader",
    description: `Create a Custom Theme: Your app instantly looks more intentional.

Build a color palette, typography and layout preview with tweakcn dot com

Grab  the CSS → drop into Bolt = cohesive design`,
    href: "https://x.com/nocheerleader/status/1934648830315684275",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1937802227672109056/JHRKKC9G_400x400.jpg",
    name: "Tanpreet Jolly",
    tag: "JollyTanpreet",
    description:
      "I just tried tweakcn and seems like you nailed it. This is what I have been looking for, awesome job!",
    href: "https://x.com/JollyTanpreet/status/1926923858721808484",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1677359164580929544/jngFF04Y_400x400.jpg",
    name: "Code With Antonio",
    tag: "YTCodeAntonio",
    description: "there is an entire chapter dedicated to tweakcn!! such a cool project",
    href: "https://x.com/YTCodeAntonio/status/1938314416497549430",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1942939901994893312/epjxuhCr_400x400.jpg",
    name: "Emir",
    tag: "emirthedev",
    description: "Started using tweakcn for client projects too. This is a real game changer",
    href: "https://x.com/emirthedev/status/1919418644183843211",
  },
  {
    image: "https://pbs.twimg.com/profile_images/1903255064149442560/TYvinGL9_400x400.jpg",
    name: "Matt Silverlock",
    tag: "elithrar",
    description: `used this shadcn theme editor to make it a little less plain: tweakcn.com`,
    href: "https://x.com/elithrar/status/1905704716589510889",
  },
];

const MarqueeRow = ({
  items,
  reverse = false,
}: {
  items: typeof testimonials;
  reverse?: boolean;
}) => {
  const shouldReduceMotion = useReducedMotion();
  const x = useRef(useMotionValue(0));
  const speed = shouldReduceMotion ? 0 : 20;
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef(0);
  const lastTime = useRef(performance.now());
  const isPaused = useRef(false);
  const [duplicateCount, setDuplicateCount] = useState(2);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      const cardWidth = 400;
      const screenWidth = window.innerWidth;
      const cardsNeeded = Math.ceil(screenWidth / cardWidth) + 3;
      const loopCount = Math.ceil(cardsNeeded / items.length);
      setDuplicateCount(loopCount);

      const totalWidth = cardWidth * items.length * loopCount;
      setContainerWidth(totalWidth);
      x.current.set(reverse ? -totalWidth / 2 : 0);
    }
  }, [items.length, reverse]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const animate = (time: number) => {
      const delta = time - lastTime.current;
      lastTime.current = time;

      if (!isPaused.current && containerRef.current) {
        const direction = reverse ? 1 : -1;
        const distance = (speed * delta * direction) / 1000;
        const currentX = x.current.get();

        let newX = currentX + distance;

        if (reverse && newX >= 0) {
          newX = -containerWidth / 2;
        } else if (!reverse && Math.abs(newX) >= containerWidth / 2) {
          newX = 0;
        }

        x.current.set(newX);
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [containerWidth, reverse, shouldReduceMotion, speed]);

  const pause = () => (isPaused.current = true);
  const resume = () => {
    lastTime.current = performance.now();
    isPaused.current = false;
  };

  const repeatedItems = Array(duplicateCount)
    .fill(null)
    .flatMap(() => items);

  return (
    <div
      className="relative w-full overflow-hidden py-1.5"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <motion.div
        ref={containerRef}
        style={{ x: x.current }}
        onMouseEnter={pause}
        onMouseLeave={resume}
        className={`flex w-max items-stretch gap-3 ${reverse ? "flex-row-reverse" : ""}`}
      >
        {repeatedItems.map((testimonial, i) => (
          <Card
            key={i}
            className="border border-border/60 bg-card hover:border-border hover:bg-card/80 group max-h-[220px] w-full max-w-[400px] min-w-[280px] overflow-hidden transition-all rounded-sm shadow-none"
          >
            <Link
              href={testimonial.href}
              className="h-full block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CardContent className="flex h-full w-[280px] flex-col gap-3 p-4 md:w-[380px]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 rounded-sm">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} loading="lazy" />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold rounded-sm">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">@{testimonial.tag}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 line-clamp-4 whitespace-pre-wrap leading-relaxed">
                  {testimonial.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full border-b border-border/60">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="border-b border-border/60 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <p className="label-eyebrow mb-4">Social proof</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                Loved by
                <br />
                <em className="not-italic font-light font-serif text-muted-foreground">developers.</em>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-muted-foreground text-base max-w-xs md:text-right leading-relaxed"
            >
              Join thousands of developers building beautiful interfaces with tweakcn.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Full-bleed marquee rows */}
      <div className="py-8 flex flex-col gap-3">
        <MarqueeRow items={testimonials.slice(0, 5)} reverse={false} />
        <MarqueeRow items={testimonials.slice(5, 10)} reverse={true} />
      </div>
    </section>
  );
}
