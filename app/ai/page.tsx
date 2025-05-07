import { AuthDialogWrapper } from "@/components/auth-dialog-wrapper";
import { AiChatForm } from "./components/ai-chat-form";

export default function AiPage() {
  return (
    <>
      <AuthDialogWrapper />
      <div className="relative container mx-auto flex h-full flex-1 flex-col items-center justify-center px-4 py-8 md:px-6">
        <section className="mx-auto flex w-full max-w-[49rem] flex-col gap-4">
          <h1 className="animate-text from-foreground via-muted-foreground to-foreground bg-gradient-to-r bg-[200%_auto] bg-clip-text text-center text-[29px] font-semibold tracking-tighter text-pretty text-transparent sm:text-[32px] md:text-[46px]">
            What can I help you theme?
          </h1>
          <div className="relative mx-auto w-full content-center">
            <div className="relative isolate z-10 w-full">
              <AiChatForm />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_70%,var(--secondary),transparent_15%)] blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_30%,var(--primary),transparent_15%)] blur-3xl"></div>
          </div>
        </section>

        {/* TODO: Split Screen for Theme Preview Section */}
      </div>
    </>
  );
}
