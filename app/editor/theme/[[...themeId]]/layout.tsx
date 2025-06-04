import { Header } from "@/components/header";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex h-svh flex-col overflow-hidden">
      <Header />
      <main className="isolate flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
