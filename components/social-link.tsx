import { ReactNode } from "react";

interface SocialLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function SocialLink({ href, children, className = "" }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-foreground/60 hover:text-foreground transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
