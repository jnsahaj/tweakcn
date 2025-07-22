import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PenLine } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface EditButtonProps extends React.ComponentProps<typeof Button> {
  themeId: string;
}

export function EditButton({ themeId, disabled, className, ...props }: EditButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditing = pathname.includes(themeId);

  // Keep the current search params for tab persistence
  const href = `/editor/theme/${themeId}?${searchParams}`;

  return (
    <TooltipWrapper label="Edit theme" asChild>
      <Link href={href}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(className)}
          disabled={disabled || isEditing}
          {...props}
        >
          <PenLine className="size-3.5" />
          <span className="hidden text-sm md:block">Edit</span>
        </Button>
      </Link>
    </TooltipWrapper>
  );
}
