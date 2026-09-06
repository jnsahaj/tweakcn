import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OpenInTweakcnButton({
  url,
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & { url: string; disabled?: boolean }) {
  const openInTweakcnUrl = `https://tweakcn.com/editor/theme?p=custom&url=${encodeURIComponent(url)}`;

  return (
    <Button
      aria-label="Open in tweakcn"
      title="Open in tweakcn"
      asChild
      disabled={disabled}
      {...props}
    >
      <a
        href={openInTweakcnUrl}
        target="_blank"
        rel="noreferrer"
        className={cn("gap-1", disabled && "pointer-events-none opacity-50")}
      >
        Open in{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className="size-5 text-current"
          aria-hidden="true"
        >
          <rect width="256" height="256" fill="none" />

          <line
            x1="208"
            y1="128"
            x2="207.8"
            y2="128.2"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="24"
          />
          <line
            x1="168.2"
            y1="167.8"
            x2="128"
            y2="208"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="24"
          />

          <line
            x1="192"
            y1="40"
            x2="115.8"
            y2="116.2"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="24"
          />
          <line
            x1="76.2"
            y1="155.8"
            x2="40"
            y2="192"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="24"
          />

          <circle cx="188" cy="148" r="24" fill="none" stroke="currentColor" stroke-width="24" />
          <circle cx="96" cy="136" r="24" fill="none" stroke="currentColor" stroke-width="24" />
        </svg>
        <span className="sr-only">Open in tweakcn</span>
      </a>
    </Button>
  );
}
