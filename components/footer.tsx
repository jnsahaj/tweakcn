import Link from "next/link";
import Logo from "@/assets/logo.svg";
import GitHubIcon from "@/assets/github.svg";
import TwitterIcon from "@/assets/twitter.svg";
import DiscordIcon from "@/assets/discord.svg";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "Community", href: "/community" },
  { label: "Pricing", href: "/pricing" },
  { label: "AI Generator", href: "/ai" },
];

const resourceLinks = [
  { label: "GitHub", href: "https://github.com/jnsahaj/tweakcn", external: true },
  { label: "Discord", href: "https://discord.gg/Phs4u2NM3n", external: true },
  { label: "Contact", href: "https://x.com/messages/compose?recipient_id=1426676644152889345", external: true },
  { label: "Privacy Policy", href: "/privacy-policy", external: false },
];

export function Footer() {
  return (
    <footer className="w-full bg-background">
      <div className="container mx-auto px-4 md:px-6">

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-0 border-b border-border/60">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 py-12 border-b md:border-b-0 md:border-r border-border/60 pr-0 md:pr-10">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="size-5" />
              <span className="text-sm font-semibold tracking-tight">tweakcn</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px] mb-6">
              A visual theme editor for shadcn/ui. Customize, preview, and export — free and open source.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/jnsahaj/tweakcn"
                className="size-8 flex items-center justify-center rounded-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="size-4" />
              </a>
              <a
                href="https://discord.gg/Phs4u2NM3n"
                className="size-8 flex items-center justify-center rounded-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                aria-label="Discord"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DiscordIcon className="size-4" />
              </a>
              <a
                href="https://x.com/iamsahaj_xyz"
                className="size-8 flex items-center justify-center rounded-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                aria-label="Twitter / X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Spacer on desktop */}
          <div className="hidden md:block" />

          {/* Product links */}
          <div className="py-12 pl-0 md:pl-0 border-r border-border/60 pr-10">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">
              Product
            </p>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div className="py-12 pl-10">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-5">
              Resources
            </p>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} tweakcn
          </p>
          <p className="text-xs text-muted-foreground/40 font-mono">
            v2
          </p>
        </div>
      </div>
    </footer>
  );
}
