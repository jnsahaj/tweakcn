import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LinkedinIcon, TwitterIcon, ZapIcon } from "lucide-react";

const navigation = [
  {
    title: "Product",
    links: [
      { label: "Features" },
      { label: "Pricing" },
      { label: "Integrations", badge: "New" },
      { label: "Demo" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About Us" }, { label: "Careers" }, { label: "Blog" }, { label: "Press" }],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center" },
      { label: "FAQs" },
      { label: "Guides" },
      { label: "Community" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
      { label: "Security" },
      { label: "Cookie Settings" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background w-full py-12 lg:py-20" aria-label="Website footer">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 lg:gap-9 lg:px-8">
        {/* Navigation */}
        <nav
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-9"
          aria-label="Footer navigation"
        >
          {navigation.map((section) => (
            <div key={section.title} className="flex flex-col gap-2.5">
              <h3 className="text-muted-foreground text-sm font-medium">{section.title}</h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label} className="text-base">
                    <a href="#" className="flex items-center gap-1">
                      {link.label}
                      {"badge" in link && <Badge variant="outline">{link.badge}</Badge>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <Separator aria-hidden="true" />

        {/* Logo, social links, and copyright */}
        <div className="flex flex-col gap-9 md:flex-row md:items-center md:justify-between">
          <a href="#" aria-label="Go to home page" className="flex shrink-0 items-center gap-1">
            <ZapIcon className="text-primary size-5" />
            <span className="text-primary text-sm font-medium whitespace-nowrap">Acme Inc.</span>
          </a>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3 md:gap-4">
              <LinkedinIcon className="size-4" />
              <TwitterIcon className="size-4" />
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; Copyright Acme Inc. 2025. All right reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
