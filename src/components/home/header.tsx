import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Menu, Moon, Sun, X, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.png";

interface HeaderProps {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function Header({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 shadow-xs border-b border-border/20"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 px-4 min-w-full items-center justify-between">
        <Link to="/">
          <div className="flex items-center gap-2 font-bold">
            <motion.img
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              src={logo}
              alt="tweakcn"
              className="h-8 w-8 mr-1 md:mr-2"
            />
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              tweakcn
            </motion.span>
          </div>
        </Link>
        <nav className="hidden md:flex gap-8">
          {["Examples", "Features", "How It Works", "Roadmap", "FAQ"].map(
            (item, i) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            )
          )}
        </nav>
        <div className="hidden md:flex gap-4 items-center cursor-pointer">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full transition-transform hover:scale-105"
            >
              {theme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Link to="/editor/theme">
              <Button className="rounded-full cursor-pointer transition-transform hover:scale-105 font-medium">
                Try It Now
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
        <div className="flex items-center gap-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
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
          className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
        >
          <div className="container py-4 flex flex-col gap-4 px-4">
            {["Examples", "Features", "How It Works", "Roadmap", "FAQ"].map(
              (item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="py-2 text-sm font-medium relative overflow-hidden group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              )
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="pt-2 mt-2 border-t border-border/30"
            >
              <Link to="/editor/theme" onClick={() => setMobileMenuOpen(false)}>
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
