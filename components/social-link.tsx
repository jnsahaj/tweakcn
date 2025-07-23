import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface SocialLinkProps extends React.ComponentProps<"a"> {
  showIcon?: boolean;
}

export function SocialLink({ href, children, className, showIcon = false }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-foreground/60 hover:text-foreground inline-flex w-fit items-center transition-colors",
        className
      )}
    >
      {children}
      {showIcon && <ArrowUpRight className="size-3 transition group-hover/link:rotate-45" />}
    </a>
  );
}
