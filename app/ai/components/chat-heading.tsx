export function ChatHeading({ isGeneratingTheme }: { isGeneratingTheme: boolean }) {
  return (
    <h1
      style={
        {
          "--gradient-accent": isGeneratingTheme ? "var(--foreground)" : "var(--foreground)",
          "--gradient-base": isGeneratingTheme ? "var(--muted-foreground)" : "var(--foreground)",
        } as React.CSSProperties
      }
      className="animate-text bg-gradient-to-r from-(--gradient-base) via-(--gradient-accent) to-(--gradient-base) bg-[200%_auto] bg-clip-text pb-4 text-center text-[clamp(24px,7cqw,46px)] font-semibold tracking-tighter text-pretty text-transparent"
    >
      What can I help you theme?
    </h1>
  );
}
