import { Link } from "react-router";
import Logo from "@/assets/logo.svg?react";
import GitHubIcon from "@/assets/github.svg?react";
import TwitterIcon from "@/assets/twitter.svg?react";
import DiscordIcon from "@/assets/discord.svg?react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
      <div className="container max-w-8xl mx-auto flex flex-col gap-8 px-4 md:px-0 py-10 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4 col-span-2 max-w-md">
            <Link to="/" className="flex items-center gap-2 font-bold">
              <Logo className="size-6" />
              <span>tweakcn</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A powerful visual theme editor for shadcn/ui components with Tailwind
              CSS support. Make your components stand out.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/jnsahaj/tweakcn"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitHubIcon className="size-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://discord.gg/Phs4u2NM3n"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <DiscordIcon className="size-5" />
                <span className="sr-only">Discord</span>
              </a>
              <a
                href="https://x.com/iamsahaj_xyz"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <TwitterIcon className="size-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#examples"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Examples
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/jnsahaj/tweakcn"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/Phs4u2NM3n"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/messages/compose?recipient_id=1426676644152889345"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} tweakcn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
