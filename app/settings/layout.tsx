import { Header } from "@/components/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SettingsSidebar } from "./components/settings-sidebar";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />

      <div className="container mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 pt-8 pb-4 md:justify-start md:px-6">
        <Button variant="ghost" asChild>
          <Link href="/editor/theme">
            <ArrowLeft /> Back to Editor
          </Link>
        </Button>

        <ThemeToggle variant="ghost" size="icon" />
      </div>

      <main className="container mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-4 md:flex-row md:px-6 md:py-8">
        <SettingsSidebar />
        <div className="mx-auto w-full max-w-4xl flex-1">{children}</div>
      </main>
    </div>
  );
}
