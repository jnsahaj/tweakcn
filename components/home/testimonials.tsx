'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import man1 from '@/assets/man1.png';
import man2 from '@/assets/man2.png';
import girl1 from '@/assets/girl1.png';
import girl2 from '@/assets/girl2.png';
import girl3 from '@/assets/girl3.png';

// Testimonials Data
const testimonials = [
  {
    image: man1.src,
    name: 'Sanwal Sulehri',
    tag: 'sanwalakram12',
    description: `Playing around with @tweakcn suddenly made me feel inspired to launch that side project.`,
  },
  {
    image: man2.src,
    name: 'Darius Flynn',
    tag: 'flynnn',
    description: `Exploring @tweakcn's sleek UI. It's like a dark mode enthusiast's playground.`,
  },
  {
    image: girl1.src,
    name: 'Olivia Blackwood',
    tag: 'olivia1992',
    description: `@tweakcn is slick. That globe graphic though.`,
  },
  {
    image: girl2.src,
    name: 'Esme Rothschild',
    tag: 'EmeRothArt',
    description: `Just made my first website with @tweakcn.`,
  },
  {
    image: girl3.src,
    name: 'Kai Nakamura',
    tag: 'KaiNakWaves',
    description: `@tweakcn is a game-changer for rapid prototyping.`,
  },
  {
    name: 'Suna Martinez',
    tag: 'sunacode',
    description: `@tweakcn is not messing around with its component library game.`,
  },
];

const MarqueeRow = ({
  items,
  reverse = false,
}: {
  items: typeof testimonials;
  reverse?: boolean;
}) => {
  const x = useRef(useMotionValue(0));
  const speed = 50;
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef(0);
  const lastTime = useRef(performance.now());
  const isPaused = useRef(false);
  const [duplicateCount, setDuplicateCount] = useState(2);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      const cardWidth = 300;
      const screenWidth = window.innerWidth;
      const cardsNeeded = Math.ceil(screenWidth / cardWidth) + 3;
      const loopCount = Math.ceil(cardsNeeded / items.length);
      setDuplicateCount(loopCount);

      const totalWidth = cardWidth * items.length * loopCount;
      setContainerWidth(totalWidth);
      x.current.set(reverse ? -totalWidth / 2 : 0); // Start offset for reverse
    }
  }, [items.length, reverse]);

  useEffect(() => {
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
  }, [containerWidth, reverse]);

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
      className="relative w-full overflow-hidden py-2"
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      <motion.div
        ref={containerRef}
        style={{ x: x.current }}
        onMouseEnter={pause}
        onMouseLeave={resume}
        className={`flex w-max gap-4 items-stretch ${reverse ? 'flex-row-reverse' : ''}`}
      >
        {repeatedItems.map((testimonial, i) => (
          <Card
            key={i}
            className="sm:max-w-[400px] min-w-[260px] max-w-[330px] sm:min-w-[300px] w-full border border-border/40 bg-gradient-to-b from-card to-card/50 backdrop-blur transition-all hover:shadow-lg hover:border-primary/20 group"
          >
            <CardContent className="flex flex-col p-6 gap-4 h-full">
              <div className="flex items-center gap-3">
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
                  <h3 className="text-foreground text-xl font-semibold">
                    {testimonial.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">@{testimonial.tag}</p>
                </div>
              </div>
              <p className="text-foreground">{testimonial.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

// Testimonials Main Section
export function Testimonials() {
  return (
    <section id="testimonials" className="relative isolate w-full py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(from_var(--primary)_r_g_b_/_0.03),transparent_70%)]" />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <Badge className="rounded-full px-4 py-1.5 text-sm font-medium shadow-sm" variant="secondary">
            <span className="text-primary mr-1">✦</span> Testimonials
          </Badge>
          <h2 className="from-foreground to-foreground/80 max-w-[600px] bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Loved by designers and developers across the planet
          </h2>
          <p className="text-muted-foreground max-w-[500px] md:text-lg">
            Here&apos;s what people are saying about tweakcn
          </p>
        </motion.div>

        {/* 🚀 Two Marquee Rows */}
        <div className="flex flex-col gap-y-0">
          <MarqueeRow items={testimonials} reverse={false} />
          <MarqueeRow items={testimonials} reverse={true} />
        </div>
      </div>
    </section>
  );
}
