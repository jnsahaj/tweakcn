import { Header } from "@/components/header";

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-svh flex-col">
      <Header />
      <main className="isolate flex flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
