import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const faqs = [
  {
    question: "What is tweakcn?",
    answer:
      "tweakcn is a visual theme editor for shadcn/ui components. It allows you to customize your theme visually and export the code for your project.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes, the core features are completely free. We offer a Pro plan for advanced AI features.",
  },
  {
    question: "What is included in Pro?",
    answer:
      "Pro includes AI theme generation from images and prompts, as well as cloud saving for multiple themes.",
  },
  {
    question: "Does it support Tailwind v4?",
    answer:
      "Yes. We support both Tailwind CSS v3 and v4, along with OKLCH, HSL, and other color formats.",
  },
  {
    question: "Can I use it with existing projects?",
    answer:
      "Absolutely. Just copy the generated configuration into your existing project. No migration needed.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full border-b border-border/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-0">

          {/* Left label column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="py-16 md:py-24 border-r-0 lg:border-r border-border/60 pr-0 lg:pr-16 flex flex-col justify-between"
          >
            <div>
              <p className="label-eyebrow mb-4">FAQ</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                Common
                <br />
                <em className="not-italic font-light font-serif text-muted-foreground">questions.</em>
              </h2>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                {"Can't"} find your answer? Reach out at{" "}
                <a href="mailto:sahaj@tweakcn.com" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
                  sahaj@tweakcn.com
                </a>
              </p>
            </div>
          </motion.div>

          {/* Right: accordion */}
          <div className="py-16 md:py-24 pl-0 lg:pl-16">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${i}`}
                    className="border-b border-border/60 last:border-0"
                  >
                    <AccordionTrigger className="hover:no-underline text-base font-medium py-5 text-left pr-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
