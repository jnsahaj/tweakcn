import Logo from "@/assets/logo.svg";
import { Sparkle } from "lucide-react";

export function LoadingLogo() {
  return (
    <div className="relative mx-auto size-full">
      <div className="bg-primary/90 absolute inset-0 m-auto size-[65%] animate-ping rounded-full" />
      <div className="bg-primary/30 absolute inset-0 m-auto size-[85%] animate-ping rounded-full delay-100" />
      <div className="bg-background relative isolate mx-auto size-full rounded-full p-1">
        <div className="absolute top-0 left-0 size-[30%]">
          <Sparkle className="size-full animate-pulse fill-current" />
        </div>
        <Logo className="size-full animate-pulse delay-150" />
        <div className="absolute right-0 bottom-0 size-[20%]">
          <Sparkle className="size-full animate-pulse fill-current delay-300" />
        </div>
      </div>
    </div>
  );
}
