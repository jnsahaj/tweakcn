import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

const faqs = [
  {
    question: "What is tweakcn?",
    answer:
      "tweakcn is a visual theme editor for shadcn/ui components with Tailwind CSS support. It comes with a set of pre-built themes that you can use to customize your project.",
  },
  {
    question: "Is tweakcn free to use?",
    answer:
      "Yes, tweakcn is completely free to use. We may introduce premium features in the future, but the core functionality will always remain free.",
  },
  {
    question: "What is tweakcn Pro and what does it include?",
    answer:
      "tweakcn Pro is a premium subscription service available for $8 per month. It unlocks all of tweakcn's advanced features, including powerful AI theme generation. You can cancel your subscription at any time and still benefit from the core functionality.",
  },
  {
    question: "How do I customize a shadcn/ui theme?",
    answer:
      "You can customize a shadcn/ui theme by selecting the a preset theme you want to use from the dropdown menu and then adjusting the colors to you liking. Once you are happy with the theme, you can export the code by either copying it or running the command to apply the theme to your project automatically.",
  },
  {
    question: "Does tweakcn support Tailwind CSS v4?",
    answer:
      "Yes, tweakcn supports Tailwind CSS v4 (and v3). You can choose the version of Tailwind CSS you want to use from the dropdown menu in the Code section. It also supports multiple color formats to best suit your project.",
  },
  {
    question: "Do I need to know Tailwind CSS to use tweakcn?",
    answer:
      "No, you don't need to know Tailwind CSS to use tweakcn. Our visual editor makes it easy to customize components without writing any code. However, having some knowledge of Tailwind CSS will help you understand the generated code better.",
  },
  {
    question: "Can I use tweakcn with my existing shadcn/ui project?",
    answer:
      "Yes, tweakcn is designed to work with existing shadcn/ui projects. You can export the generated code by either copying it or running the command to apply the theme to your project automatically.",
  },
  {
    question: "Is tweakcn open source?",
    answer:
      "Yes :) tweakcn is open source. You can find the source code on GitHub and contribute to the project if you'd like to help improve it. You can also join the discord server to get help from the community.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="w-full py-20 md:py-32">
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
            <span className="text-primary mr-1">✦</span> FAQ
          </Badge>
          <h2 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-[800px] md:text-lg">
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
                <AccordionItem value={`item-${i}`} className="border-border/40 group border-b py-2">
                  <AccordionTrigger className="group-hover:text-primary text-left font-medium transition-colors hover:no-underline">
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
