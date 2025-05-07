import { Header } from "@/components/editor/header";

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-grow flex-col">{children}</main>
    </div>
  );
}
