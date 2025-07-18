"use client";

import { Footer } from "@/components/footer";
import { AIGenerationCTA } from "@/components/home/ai-generation-cta";
import { CTA } from "@/components/home/cta";
import { FAQ } from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Roadmap } from "@/components/home/roadmap";
import { Testimonials } from "@/components/home/testimonials";
import { ThemeHotKeyHandler } from "@/components/home/theme-hotkey-handler";
import { ThemePresetSelector } from "@/components/home/theme-preset-selector";
import { useEffect, useState } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10){
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-background text-foreground flex min-h-[100dvh] flex-col items-center justify-items-center">
      <ThemeHotKeyHandler>
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="w-full flex-1">
        <Hero />
        <ThemePresetSelector />
        <Testimonials />
        <Features />
        <AIGenerationCTA />
        <HowItWorks />
        <Roadmap />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      </ThemeHotKeyHandler>
    </div>
  );
}
