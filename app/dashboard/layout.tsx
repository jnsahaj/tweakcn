import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex min-h-screen flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
