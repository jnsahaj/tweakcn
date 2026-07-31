import Link from "next/link";
import Logo from "@/assets/logo.svg";
import GitHubIcon from "@/assets/github.svg";
import TwitterIcon from "@/assets/twitter.svg";
import DiscordIcon from "@/assets/discord.svg";

const links = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Community", href: "/community" },
    { label: "Pricing", href: "/pricing" },
    { label: "AI Generator", href: "/ai" },
  ],
  resources: [
    { label: "GitHub", href: "https://github.com/jnsahaj/tweakcn", external: true },
    { label: "Discord", href: "https://discord.gg/Phs4u2NM3n", external: true },
    { label: "Contact", href: "mailto:sahaj@tweakcn.com", external: true },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--hp-rule)] bg-[var(--hp-surface)]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main footer grid */}
        <div className="grid gap-12 border-b border-[var(--hp-rule)] py-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Logo className="size-5" />
              <span className="font-mono text-sm font-semibold text-white">tweakcn</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-[var(--hp-text-secondary)]">
              A visual theme editor for shadcn/ui. Customize, preview, and export Tailwind CSS
              design tokens in real time.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://github.com/jnsahaj/tweakcn"
              className="text-[var(--hp-text-secondary)] transition-colors hover:text-white"
              aria-label="GitHub"
              >
                <GitHubIcon className="size-4" />
              </a>
              <a
                href="https://discord.gg/Phs4u2NM3n"
              className="text-[var(--hp-text-secondary)] transition-colors hover:text-white"
              aria-label="Discord"
              >
                <DiscordIcon className="size-4" />
              </a>
              <a
                href="https://x.com/iamsahaj_xyz"
              className="text-[var(--hp-text-secondary)] transition-colors hover:text-white"
              aria-label="Twitter / X"
              >
                <TwitterIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white">
              Product
            </h4>
            <ul className="space-y-2.5">
              {links.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-mono text-xs text-[var(--hp-text-secondary)] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-white">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {links.resources.map((link) => (
                <li key={link.label}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[var(--hp-text-secondary)] transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="font-mono text-xs text-[var(--hp-text-secondary)] transition-colors hover:text-white"
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
        <div className="flex flex-col items-start justify-between gap-3 py-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] text-[var(--hp-text-secondary)]">
            &copy; {new Date().getFullYear()} tweakcn. All rights reserved.
          </p>
          <p className="font-mono text-[10px] text-[var(--hp-text-secondary)]">
            Built by{" "}
            <a
              href="https://x.com/iamsahaj_xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--hp-accent)] hover:underline"
            >
              @iamsahaj_xyz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
