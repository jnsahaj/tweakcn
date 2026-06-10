import { cn } from "@/lib/utils";

export function SectionHeading({
  tagline,
  title,
  body,
  align = "center",
  className,
}: {
  tagline?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-3xl flex-col gap-3",
        align === "center" ? "mx-auto items-center text-center" : "items-start text-left",
        className
      )}
    >
      {tagline && <span className="text-primary text-base font-medium">{tagline}</span>}
      <h2 className="text-3xl font-medium tracking-tight text-balance lg:text-4xl">{title}</h2>
      {body && <p className="text-muted-foreground max-w-2xl text-base text-pretty">{body}</p>}
    </div>
  );
}
