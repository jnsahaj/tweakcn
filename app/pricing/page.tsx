import { NoiseEffect } from "@/components/effects/noise-effect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_REQUEST_FREE_TIER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { FREE_SUB_FEATURES, PRO_SUB_FEATURES } from "@/utils/subscription";
import { Calendar, Check, Circle, Mail } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./components/checkout-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — tweakcn",
  robots: "index, follow",
};

const PromoBadge = () => {
  return (
    <div className="mb-6 flex min-w-80 items-center justify-center">
      <div className="bg-muted border-primary/10 inline-flex items-center gap-2 rounded-full border px-4 py-2">
        <span className="text-muted-foreground text-sm">Use code</span>
        <div className="flex items-center gap-1">
          <code className="bg-primary/80 border-border text-primary-foreground rounded border px-2 py-1 font-mono text-xs font-bold">
            LAUNCH50
          </code>
        </div>
        <span className="text-muted-foreground text-sm">for 50% off</span>
      </div>
    </div>
  );
};

export default function PricingPage() {
  return (
    <div className="from-background via-background to-muted/20 relative isolate min-h-screen bg-gradient-to-br">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-0 right-0 size-80 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-secondary/10 absolute bottom-0 left-0 size-80 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto space-y-28 px-4 py-20 md:px-6">
        {/* Header Section */}
        <section className="space-y-2 text-center">
          <h1 className="from-foreground to-foreground/50 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-pretty text-transparent md:text-6xl">
            Choose your perfect plan
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-base text-balance md:text-lg">
            Start building beautiful themes for free. Upgrade to Pro when you&apos;re ready.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
          {/* Free Plan */}
          <Card className="group relative flex flex-col overflow-hidden border-2 transition-all duration-300">
            <CardHeader className="space-y-2 border-b">
              <div className="flex items-center gap-3">
                <CardTitle className="text-4xl font-medium">Free</CardTitle>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight lg:text-5xl">$0</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <p className="text-muted-foreground text-sm">No credit card required</p>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <ul className="space-y-3">
                {FREE_SUB_FEATURES.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/15 flex items-center justify-center rounded-full p-1">
                      {feature.status === "done" ? (
                        <Check className="text-primary size-3 stroke-2" />
                      ) : (
                        <Circle className="text-muted-foreground size-3 stroke-2" />
                      )}
                    </div>
                    <span className="text-sm">{feature.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="hover:bg-muted/50 h-12 w-full text-base font-medium transition-all duration-200"
                size="lg"
              >
                <Link href="/editor/theme">Get Started Free</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="group ring-primary/50 from-card to-primary/5 relative border-2 bg-gradient-to-b ring-2 transition-all duration-300">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <PromoBadge />
            </div>
            <div className="relative flex h-full flex-col">
              <CardHeader className="relative space-y-2 border-b">
                <NoiseEffect />

                <div className="flex items-center gap-3">
                  <CardTitle className="text-4xl font-medium">Pro</CardTitle>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight lg:text-5xl">$8</span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
                <p className="text-muted-foreground text-sm">Billed monthly • Cancel anytime</p>
              </CardHeader>
              <CardContent className="flex-1 pt-6">
                <p className="text-muted-foreground mb-4 text-sm font-medium">
                  Everything in Free, plus:
                </p>
                <ul className="space-y-3">
                  {PRO_SUB_FEATURES.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full p-1",
                          feature.status === "done" ? "bg-primary/15" : "bg-muted-foreground/25"
                        )}
                      >
                        {feature.status === "done" ? (
                          <Check className="text-primary size-3 stroke-2" />
                        ) : (
                          <Calendar className="text-muted-foreground size-3 stroke-2" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          feature.status === "done" ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {feature.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <CheckoutButton size="lg" className="h-12 w-full text-base font-medium" />
              </CardFooter>
            </div>
          </Card>
        </section>
        {/* FAQs Section */}
        <section className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
              FAQs
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base text-balance md:text-lg">
              Here&apos;s everything you may want to know. For any other info, just{" "}
              <Link href="mailto:sahaj@tweakcn.com" className="text-primary hover:underline">
                reach us
              </Link>
              .
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {PRICING_FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-border/40 group border-b py-2"
              >
                <AccordionTrigger className="group-hover:text-primary text-left font-medium transition-colors hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
        {/* Bottom Section */}
        <div className="text-center">
          <div className="mx-auto max-w-2xl space-y-2">
            <p className="text-muted-foreground text-pretty">
              Need something custom or have questions?
            </p>
            <Link href="mailto:sahaj@tweakcn.com">
              <Button variant="link">
                <Mail className="size-4" />
                Get in touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRICING_FAQS = [
  {
    question: "What do I get when I upgrade to Pro?",
    answer: `You get unlimited AI-generated themes, AI theme generation from images, unlimited saved themes, priority support, and more features coming soon. We're developing new features for Pro users!`,
  },
  {
    question: "Can I still use tweakcn for free?",
    answer: `Yes! tweakcn provides a comprehensive free tier that includes theme customization, access to preset themes, and up to ${AI_REQUEST_FREE_TIER_LIMIT} free AI-generated themes. You can build and export themes without any payment required.`,
  },
  {
    question: "Does tweakcn offer a free trial for the Pro plan?",
    answer: `No, there are no free trials. However, you get access to generate up to ${AI_REQUEST_FREE_TIER_LIMIT} themes with AI, plus unlimited manual theme customization using the free visual editor.`,
  },
  {
    question: "What happens to saved themes when downgrading to free?",
    answer:
      "All your created themes remain yours forever. When you downgrade from Pro, you keep full access to all themes you've built, but you'll be limited to the free tier's AI generation quota and features.",
  },
  {
    question: "Can I cancel or switch at any time?",
    answer:
      "Yes! You have complete control over your subscription. Cancel anytime through your account settings, and you'll retain Pro access until your current billing period ends before automatically switching to the free tier.",
  },
  {
    question: "How secure is the payment?",
    answer:
      "We use Polar for secure payment processing, which handles all transactions with industry-standard encryption. Your payment details are never stored on our servers.",
  },
];
