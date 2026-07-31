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
      "tweakcn is a visual theme editor for shadcn/ui. Customize your design tokens interactively, preview changes on real components, and export clean CSS for your project.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. The core editor, presets, and code export are completely free with no account required. A Pro plan unlocks AI generation features.",
  },
  {
    question: "What's included in Pro?",
    answer:
      "Pro includes AI theme generation from images and prompts, checkpoint restoration, and cloud saving for multiple themes.",
  },
  {
    question: "Does it support Tailwind v4?",
    answer:
      "Yes. tweakcn exports to both Tailwind CSS v3 and v4, with support for OKLCH, HSL, and other color formats.",
  },
  {
    question: "Can I use it with an existing project?",
    answer:
      "Absolutely. Generate your theme, copy the CSS variables, and paste them into your existing project globals. No migration needed.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full border-b border-[var(--hp-rule)] bg-[var(--hp-surface)]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header row */}
        <div className="border-b border-[var(--hp-rule)] py-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--hp-accent)]" />
              <span className="font-mono text-xs tracking-widest uppercase text-[var(--hp-accent)]">
                FAQ
              </span>
            </span>
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white md:text-4xl">
              Questions &amp; answers.
            </h2>
          </motion.div>
        </div>

        {/* Content */}
        <div className="grid gap-12 py-12 lg:grid-cols-12">
          {/* Side note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4"
          >
            <p className="text-sm leading-relaxed text-[var(--hp-text-secondary)]">
              {"Can't"} find what {"you're"} looking for? Reach out directly.
            </p>
            <a
              href="mailto:sahaj@tweakcn.com"
              className="mt-3 inline-block font-mono text-xs text-[var(--hp-accent)] hover:underline"
            >
              sahaj@tweakcn.com
            </a>
          </motion.div>

          {/* Accordion */}
          <div className="lg:col-span-8">
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
                    className="border-b border-[var(--hp-rule)] last:border-0"
                  >
                    <AccordionTrigger className="py-5 font-mono text-sm font-semibold text-white hover:text-[var(--hp-accent)] hover:no-underline transition-colors [&[data-state=open]]:text-[var(--hp-accent)]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-[var(--hp-text-secondary)]">
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
