"use client";

import GitHubIcon from "@/assets/github.svg";
import Logo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { useGithubStars } from "@/hooks/use-github-stars";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/utils/format";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

interface HeaderProps {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const navbarItems = [
  { label: "Features", href: "#features" },
  { label: "AI", href: "/ai" },
  { label: "Pricing", href: "/pricing" },
  { label: "Community", href: "/community" },
  { label: "FAQ", href: "#faq" },
];

export function Header({ isScrolled, mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href")?.slice(1);
    if (!targetId) return;
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled
          ? "border-b border-[var(--hp-rule)] bg-[var(--hp-surface)]/95 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="size-5 shrink-0" />
          <span className="font-mono text-sm font-semibold tracking-tight">tweakcn</span>
        </Link>

        {/* Desktop nav — centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          {navbarItems.map((item, i) => (
            <motion.a
              key={item.label}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.08 + i * 0.04 }}
              href={item.href}
              onClick={item.href.startsWith("#") ? handleScrollToSection : undefined}
              className="font-mono text-xs text-[var(--hp-text-secondary)] hover:text-white transition-colors duration-150"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-2 md:flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button variant="ghost" size="sm" className="font-mono text-xs gap-1.5 h-8 px-3 text-[var(--hp-text-secondary)] hover:text-white" asChild>
              <a href="https://github.com/jnsahaj/tweakcn" target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="size-4" />
                {stargazersCount > 0 && <span>{formatCompactNumber(stargazersCount)}</span>}
              </a>
            </Button>
          </motion.div>

          <ThemeToggle
            variant="ghost"
            size="icon"
            className="size-8 text-[var(--hp-text-secondary)] hover:text-white"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <Link href="/editor/theme" prefetch>
              <Button
                size="sm"
                className="h-8 rounded-none bg-[var(--hp-accent)] text-black hover:bg-[var(--hp-accent-dim)] font-mono text-xs px-4 font-semibold transition-colors"
              >
                Open Editor
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle variant="ghost" size="icon" className="size-8" />
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="border-b border-[var(--hp-rule)] bg-[var(--hp-surface)]/98 backdrop-blur-md md:hidden"
        >
          <div className="container mx-auto flex flex-col px-4 py-3 gap-1">
            {navbarItems.map((item, i) => (
              <motion.a
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: i * 0.04 }}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith("#")) handleScrollToSection(e);
                  setMobileMenuOpen(false);
                }}
                className="font-mono text-sm text-[var(--hp-text-secondary)] hover:text-white py-2 transition-colors border-b border-[var(--hp-rule)] last:border-0"
              >
                {item.label}
              </motion.a>
            ))}
            <div className="pt-3 pb-1">
              <Link href="/editor/theme" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-none bg-[var(--hp-accent)] text-black hover:bg-[var(--hp-accent-dim)] font-mono text-sm font-semibold h-10">
                  Open Editor
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
