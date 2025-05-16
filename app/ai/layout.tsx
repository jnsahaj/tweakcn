import { Header } from "@/components/header";

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex h-svh flex-col">
      <div className="z-1">
        <Header />
      </div>
      <main className="z-2 flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
