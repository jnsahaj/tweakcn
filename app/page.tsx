"use client";

import { useEffect, useState } from "react";
import { CTA } from "@/components/home/cta";
import { FAQ } from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/footer";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Roadmap } from "@/components/home/roadmap";
import { ReusableThemeSelector } from "@/components/reusable-theme-selector";

interface ThemeSelection {
  light: Record<string, string>;
  dark: Record<string, string>;
}

function AppThemeSwitcher() {
  const handleThemeSelect = (theme: ThemeSelection) => {
    console.log('Selected theme:', theme);
  };

  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold mb-2">Select a Theme</h2>
      <ReusableThemeSelector onThemeSelect={handleThemeSelect} registryUrl="" />
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <main className="flex min-h-screen flex-col">
       <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="container flex flex-col items-center">
        <Hero />
        <HowItWorks />
        <Features />
        <AppThemeSwitcher />
        <Roadmap />
        <CTA />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
