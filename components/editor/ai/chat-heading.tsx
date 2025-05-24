import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";

export function ChatHeading() {
  const { loading: aiGenerateLoading } = useAIThemeGeneration();

  return (
    <h1
      style={
        {
          "--gradient-accent": aiGenerateLoading ? "var(--foreground)" : "var(--foreground)",
          "--gradient-base": aiGenerateLoading ? "var(--muted-foreground)" : "var(--foreground)",
        } as React.CSSProperties
      }
      className="animate-text bg-gradient-to-r from-(--gradient-base) via-(--gradient-accent) to-(--gradient-base) bg-[200%_auto] bg-clip-text pb-4 text-center text-[clamp(24px,7cqw,46px)] font-semibold tracking-tighter text-pretty text-transparent"
    >
      What can I help you theme?
    </h1>
  );
}
