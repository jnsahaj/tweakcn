"use client";

import { useState, useEffect } from "react";
import { FigmaHeader } from "@/components/figma-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/assets/logo.svg";
import Shadcraft from "@/assets/shadcraft.svg";
import FigmaIcon from "@/assets/figma.svg";
import { Check, X, ArrowUpRight, Figma, Cable, Paintbrush } from "lucide-react";
import Link from "next/link";
import { FIGMA_CONSTANTS, redirectToShadcraft } from "@/lib/figma-constants";

export default function FigmaPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const steps = FIGMA_CONSTANTS.steps.map((step, index) => ({
    ...step,
    icon:
      index === 0 ? (
        <Figma className="h-6 w-6" />
      ) : index === 1 ? (
        <Cable className="h-6 w-6" />
      ) : (
        <Paintbrush className="h-6 w-6" />
      ),
  }));

  const handleGetStarted = () => {
    redirectToShadcraft();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Shadcraft Figma UI Kit - tweakcn Integration",
    description:
      "Professional Figma UI kit with 51 components, 44 blocks, dark mode support, and seamless tweakcn theme integration",
    image: "https://tweakcn.com/figma-onboarding/shadcraft-preview.jpg",
    brand: {
      "@type": "Brand",
      name: "Shadcraft",
    },
    offers: {
      "@type": "Offer",
      price: "89",
      priceCurrency: "USD",
      priceValidUntil: "2025-12-31",
      availability: "https://schema.org/InStock",
      url: FIGMA_CONSTANTS.shadcraftUrl,
      seller: {
        "@type": "Organization",
        name: "Shadcraft",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "100+",
    },
    category: "Design Software",
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Components",
        value: "51",
      },
      {
        "@type": "PropertyValue",
        name: "Blocks",
        value: "44",
      },
      {
        "@type": "PropertyValue",
        name: "Icons",
        value: "1500+",
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="relative min-h-screen">
        {/* Gradient Background using CSS variables */}
        <div className="from-background via-muted/20 to-accent/10 fixed inset-0 -z-10 bg-gradient-to-br" />
        <div className="from-primary/5 to-secondary/10 fixed inset-0 -z-10 bg-gradient-to-tr via-transparent" />

        {/* Header */}
        <FigmaHeader
          isScrolled={isScrolled}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main Content */}
        <main className="container mx-auto max-w-[600px] p-4 pt-8">
          {/* Header Section */}
          <header className="p-8 pb-5">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Logo className="h-6 w-6" alt="tweakcn logo" />
                <div className="text-lg font-bold">tweakcn</div>
              </div>
              <X className="h-4 w-4" aria-hidden="true" />
              <Link href={FIGMA_CONSTANTS.shadcraftUrl} target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-2">
                  <Shadcraft className="h-6 w-6" alt="Shadcraft logo" />
                  <div className="text-lg font-bold">shadcraft</div>
                </div>
              </Link>
            </div>
          </header>

          <div className="space-y-16 px-8 pb-32">
            {/* Hero Section */}
            <section className="space-y-6 text-center">
              <h1 className="text-5xl leading-12 font-semibold tracking-tight">
                Apply your theme to the ultimate Figma UI kit
              </h1>

              <div className="flex justify-center gap-3.5">
                <Button size="lg" className="h-10 px-8" onClick={handleGetStarted}>
                  Get started
                </Button>
                <Link href={FIGMA_CONSTANTS.previewUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="h-10 gap-2 px-8">
                    <FigmaIcon className="h-4 w-4" />
                    Preview
                  </Button>
                </Link>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-muted-foreground text-sm">Trusted by top designers</p>
                <div
                  className="flex justify-center -space-x-3"
                  role="group"
                  aria-label="Designer avatars"
                >
                  {FIGMA_CONSTANTS.designers.map((designer, index) => (
                    <Avatar key={index} className="border-background h-8 w-8 border-2">
                      <AvatarImage src={designer.avatar} alt={`${designer.name} avatar`} />
                      <AvatarFallback className="text-xs">{designer.fallback}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </section>

            {/* How it works */}
            <section className="space-y-4">
              <h2 className="text-center text-2xl font-semibold">How it works</h2>
              <div className="border-border rounded-2xl border px-6">
                <div className="divide-border grid grid-cols-3 divide-x">
                  {steps.map((step, index) => (
                    <article
                      key={index}
                      className="space-y-2 px-6 py-6 text-center first:pl-0 last:pr-0"
                    >
                      <div className="text-foreground mb-2 flex justify-center" aria-hidden="true">
                        {step.icon}
                      </div>
                      <p className="text-muted-foreground text-sm">{step.step}</p>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground sr-only text-sm">{step.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* Feature Description */}
            <section className="space-y-6 text-center">
              <div className="mx-auto max-w-sm space-y-1.5">
                <h2 className="text-2xl font-semibold">
                  Top quality Figma UI kit for professionals
                </h2>
                <p className="text-muted-foreground">
                  Shadcraft is packed with top quality components, true to the shadcn/ui ethos.
                </p>
              </div>

              {/* Demo UI Preview */}
              <figure className="border-border relative overflow-hidden rounded-2xl border">
                <img
                  src="/figma-onboarding/shadcraft-preview.jpg"
                  alt="Shadcraft Figma UI Kit Preview showing various components and design blocks"
                  className="h-auto w-full"
                  loading="lazy"
                  width="600"
                  height="400"
                />
              </figure>

              <Link href={FIGMA_CONSTANTS.shadcraftUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="link" className="gap-1 text-sm">
                  More on Shadcraft
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </section>

            {/* Pricing */}
            <section className="space-y-6">
              <h2 className="text-center text-2xl font-semibold">Pricing</h2>

              <Card className="p-6">
                <div className="grid gap-7 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold">What you get with Shadcraft</h3>
                    <ul className="space-y-2" role="list">
                      {FIGMA_CONSTANTS.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-1.5">
                          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <Badge variant="secondary" className="w-fit">
                      Introductory offer
                    </Badge>
                    <div className="space-y-1.5">
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-semibold">$89</span>
                      </div>
                      <div className="text-muted-foreground text-sm line-through">$119</div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={handleGetStarted}>
                        Get started
                      </Button>
                      <Link
                        href={FIGMA_CONSTANTS.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="gap-2">
                          <FigmaIcon className="h-4 w-4" />
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
              <p className="text-muted-foreground text-center text-xs">Prices in USD</p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
