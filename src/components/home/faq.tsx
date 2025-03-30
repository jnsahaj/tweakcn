import { Badge } from "@/components/ui/badge";
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
      "tweakcn is a visual theme editor for shadcn/ui components with Tailwind CSS support. It helps you customize your components to make them stand out, without having to write complex CSS or Tailwind classes manually.",
  },
  {
    question: "Is tweakcn free to use?",
    answer:
      "Yes, tweakcn is completely free to use during the beta period. We may introduce premium features in the future, but the core functionality will always remain free.",
  },
  {
    question: "Do I need to know Tailwind CSS to use tweakcn?",
    answer:
      "No, you don't need to know Tailwind CSS to use tweakcn. Our visual editor makes it easy to customize components without writing any code. However, having some knowledge of Tailwind CSS will help you understand the generated code better.",
  },
  {
    question: "Which components are currently supported?",
    answer:
      "Currently, tweakcn supports the Button component from shadcn/ui. We're actively working on adding support for more components like Input, Select, and others in future updates.",
  },
  {
    question: "Can I use tweakcn with my existing shadcn/ui project?",
    answer:
      "Yes, tweakcn is designed to work with existing shadcn/ui projects. You can customize components and export the code to integrate with your project seamlessly.",
  },
  {
    question: "Is tweakcn open source?",
    answer:
      "Yes, tweakcn is open source. You can find the source code on GitHub and contribute to the project if you'd like to help improve it.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full py-20 md:py-32">
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
            <span className="mr-1 text-primary">✦</span> FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Find answers to common questions about tweakcn.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="border-b border-border/40 py-2 group"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline group-hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
