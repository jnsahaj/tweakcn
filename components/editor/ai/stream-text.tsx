import { Response } from "@/components/ai-elements/response";

interface StreamTextProps {
  text: string;
  animate?: boolean;
  markdown?: boolean;
  className?: string;
}

export function StreamText({
  text,
  animate = false,
  markdown = false,
  className,
}: StreamTextProps) {
  if (markdown)
    return (
      <Response className={className} isAnimating={animate} animated>
        {text}
      </Response>
    );

  return <span className={className}>{text}</span>;
}
