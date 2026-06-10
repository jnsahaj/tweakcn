import { Button } from "@/components/ui/button";
import { ZapIcon } from "lucide-react";

const links = ["Products", "Solutions", "Pricing", "Company"];

export function Nav() {
  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <a href="#" className="flex shrink-0 items-center gap-1">
          <ZapIcon className="text-primary size-5" />
          <span className="text-primary text-sm font-medium whitespace-nowrap">Acme Inc.</span>
        </a>

        <nav className="hidden items-center md:flex">
          {links.map((link) => (
            <Button key={link} variant="ghost" size="sm" asChild>
              <a href="#">{link}</a>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button size="sm">Get started</Button>
        </div>
      </div>
    </header>
  );
}
