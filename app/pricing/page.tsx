import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "./components/checkout-button";

export default function PricingPage() {
  const freeFeatures = [
    "Create and share upto 10 themes",
    "Full theme customization",
    "5 AI generated themes",
    "Import theme using CSS variables",
    "Export via CSS variables",
    "Export via Registry Command",
  ];

  const proFeatures = [
    "Create and share unlimited themes",
    "Create unlimited AI generated themes",
    "Generate beautiful themes from images",
    "Priority support",
  ];

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-secondary/5 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        {/* Header Section */}
        <div className="mb-20 text-center">
          <h1 className="from-foreground to-foreground/70 mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
            Choose your perfect plan
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed">
            Start building beautiful themes for free. Upgrade to Pro when you&apos;re ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
          {/* Free Plan */}
          <Card className="group relative flex flex-col overflow-hidden border-2 transition-all duration-300">
            <CardHeader className="pt-8 pb-8">
              <div className="mb-6 flex items-center gap-3">
                <CardTitle className="text-4xl font-medium">Free</CardTitle>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tight">$0</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">No credit card required</p>
            </CardHeader>
            <CardContent className="flex-1 pb-8">
              <ul className="space-y-4">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full">
                      <Check className="text-primary h-3 w-3" />
                    </div>
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="hover:bg-muted/50 h-12 w-full text-base font-medium transition-all duration-200"
                size="lg"
              >
                Get Started Free
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="group ring-primary/50 from-card to-primary/5 relative overflow-hidden border-2 bg-gradient-to-b ring-2 transition-all duration-300">
            <div className="relative flex h-full flex-col">
              <CardHeader className="py-8">
                <div className="mb-6 flex items-center gap-3">
                  <CardTitle className="text-4xl font-medium">Pro</CardTitle>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight">$8</span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Billed monthly • Cancel anytime
                </p>
              </CardHeader>
              <CardContent className="flex-1 pb-8">
                <div className="bg-muted/30 mb-4 rounded-lg py-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Everything in Free, plus:
                  </p>
                </div>
                <ul className="space-y-4">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="bg-primary/10 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full">
                        <Check className="text-primary h-3 w-3" />
                      </div>
                      <span className="text-sm leading-relaxed font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-0">
                <CheckoutButton />
              </CardFooter>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="text-muted-foreground mb-2">Need something custom or have questions?</p>
            <Link href="mailto:sahaj@tweakcn.com">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                Get in touch
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
