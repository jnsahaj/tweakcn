import { Response } from "@/components/ai-elements/response";
import { useStreamText } from "@/hooks/use-stream-text";
import { useCallback, useEffect, useRef } from "react";

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
  const contentRef = useRef("");
  const { stream, addPart } = useStreamText();

  useEffect(() => {
    if (!text || !animate) return;

    if (contentRef.current !== text) {
      const delta = text.slice(contentRef.current.length);
      if (delta) {
        addPart(delta);
      }
      contentRef.current = text;
    }
  }, [text, animate, addPart]);

  const wrap = useCallback(
    (text: string) => {
      if (markdown) return <Response className={className}>{text}</Response>;
      else return <span className={className}>{text}</span>;
    },
    [markdown]
  );

  if (!animate) return wrap(text);

  return wrap(stream ?? text ?? "");
}
