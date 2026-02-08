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
    question: "What's included in Pro?",
    answer:
      "Pro includes AI theme generation from images and prompts, as well as cloud saving for multiple themes.",
  },
  {
    question: "Supports Tailwind v4?",
    answer:
      "Yes! We support both Tailwind CSS v3 and v4, along with OKLCH, HSL, and other color formats.",
  },
  {
    question: "Can I use with existing projects?",
    answer:
      "Absolutely. Just copy the generated configuration into your existing project.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-12 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              FAQ
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, feel free to reach out.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Contact us at <a href="#" className="text-primary underline">sahaj@tweakcn.com</a></p>
            </div>
          </motion.div>

          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <AccordionItem value={`item-${i}`} className="border rounded-lg px-4 bg-muted/20">
                    <AccordionTrigger className="hover:no-underline text-lg font-medium py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 text-base">
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
