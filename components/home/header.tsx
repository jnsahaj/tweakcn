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
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 border-b border-border/60 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="size-5 text-foreground" />
          <span className="text-sm font-semibold tracking-tight">tweakcn</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-0">
          {navbarItems.map((item, i) => (
            <motion.a
              key={item.label}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
              href={item.href}
              onClick={item.href.startsWith("#") ? handleScrollToSection : undefined}
              className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1.5 h-8 px-3 text-muted-foreground hover:text-foreground">
              <a
                href="https://github.com/jnsahaj/tweakcn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="size-4" />
                {stargazersCount > 0 && (
                  <span className="font-mono text-[11px]">{formatCompactNumber(stargazersCount)}</span>
                )}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <ThemeToggle
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Link href="/editor/theme" prefetch>
              <Button
                size="sm"
                className="h-8 px-4 text-xs rounded-sm font-medium"
              >
                Open Editor
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle variant="ghost" size="icon" className="h-8 w-8" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
          className="bg-background border-b border-border md:hidden"
        >
          <div className="container mx-auto flex flex-col px-4 py-4 gap-1">
            {navbarItems.map((item, i) => (
              <motion.a
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: i * 0.04 }}
                href={item.href}
                onClick={(e) => {
                  handleScrollToSection(e);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-border/40 last:border-0"
              >
                {item.label}
              </motion.a>
            ))}
            <div className="pt-3">
              <Link href="/editor/theme" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-sm rounded-sm" size="sm">
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
