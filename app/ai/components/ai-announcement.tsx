import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function AIAnnouncement() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={"/editor/theme?tab=ai"}
        className="group bg-muted flex items-center justify-between gap-2 rounded-full px-2 py-1.5 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs font-medium capitalize">
          Beta
        </span>
        <span className="text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors">
          Try the new AI Theme Editor
        </span>

        <ArrowRight className="text-muted-foreground group-hover:text-foreground size-4 -rotate-45 transition-all group-hover:rotate-0" />
      </Link>
    </div>
  );
}
