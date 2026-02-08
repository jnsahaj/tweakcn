"use client";

import GitHubIcon from "@/assets/github.svg";
import Logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { useGithubStars } from "@/hooks/use-github-stars";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/utils/format";
import { ChevronRight, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

interface HeaderProps {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const navbarItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "AI",
    href: "/ai",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Community",
    href: "/community",
  },
  {
    label: "FAQ",
    href: "#faq",
  },
];

export function Header({ isScrolled, mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href")?.slice(1);
    if (!targetId) return;

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-lg",
        isScrolled ? "bg-background/90 border-border/20 border-b shadow-xs" : "bg-transparent"
      )}
    >
      <div className="container mx-auto relative flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/">
          <div className="flex items-center gap-2 font-bold">
            <Logo className="size-6" />
            <span className="hidden lg:block">tweakcn</span>
          </div>
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-4 md:flex lg:gap-8">
          {navbarItems.map((item, i) => (
            <motion.a
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              href={item.href}
              onClick={item.href.startsWith("#") ? handleScrollToSection : undefined}
              className="text-muted-foreground hover:text-foreground group relative text-xs font-medium transition-colors lg:text-sm"
            >
              {item.label}
              <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}
        </nav>
        <div className="hidden cursor-pointer items-center gap-4 md:flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <Button variant="ghost" asChild>
              <a
                href="https://github.com/jnsahaj/tweakcn"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold"
              >
                <GitHubIcon className="size-5" />
                {stargazersCount > 0 && formatCompactNumber(stargazersCount)}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <ThemeToggle
              variant="secondary"
              size="icon"
              className="rounded-full transition-transform hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Link href="/editor/theme" prefetch>
              <Button className="cursor-pointer rounded-full font-medium transition-transform hover:scale-105">
                Try It Now
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle variant="ghost" size="icon" />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-background/95 absolute inset-x-0 top-16 border-b backdrop-blur-lg md:hidden"
        >
          <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
            {navbarItems.map((item, i) => (
              <motion.a
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                href={item.href}
                onClick={(e) => {
                  handleScrollToSection(e);
                  setMobileMenuOpen(false);
                }}
                className="group relative overflow-hidden py-2 text-sm font-medium"
              >
                <span className="relative z-10">{item.href}</span>
                <span className="bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="border-border/30 mt-2 border-t pt-2"
            >
              <Link href="/editor/theme" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-full">
                  Try It Now
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
