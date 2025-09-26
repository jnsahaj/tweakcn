import Link from "next/link";
import Logo from "@/assets/logo.svg";
import GitHubIcon from "@/assets/github.svg";
import TwitterIcon from "@/assets/twitter.svg";
import DiscordIcon from "@/assets/discord.svg";

export function Footer() {
  return (
    <footer className="bg-background/95 w-full border-t backdrop-blur-sm">
      <div className="container mx-auto flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 max-w-md space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Logo className="size-6" />
              <span>tweakcn</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              A powerful visual theme editor for shadcn/ui components with Tailwind CSS support.
              Make your components stand out.
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
                <Link
                  href="/#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#examples"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Examples
                </Link>
              </li>
              <li>
                <Link
                  href="/#roadmap"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Roadmap
                </Link>
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

        <div className="border-border/40 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} tweakcn. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            <Link href="/privacy-policy">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
