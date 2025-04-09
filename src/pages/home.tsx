import { useEffect, useState } from "react";
import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { ThemePresetSelector } from "@/components/home/theme-preset-selector";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Roadmap } from "@/components/home/roadmap";
import { FAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/home/footer";

export default function Component() {
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
    <div className="flex min-h-[100dvh] justify-items-center items-center flex-col bg-background text-foreground">
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="flex-1">
        <Hero />
        <ThemePresetSelector />
        <Features />
        <HowItWorks />
        <Roadmap />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
