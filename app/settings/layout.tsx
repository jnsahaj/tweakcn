import { Header } from "@/components/header";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="from-background to-muted/30 min-h-screen bg-gradient-to-b">
      <Header />
      <div className="container mx-auto flex flex-col gap-8 px-4 py-8 md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 md:flex-shrink-0">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors md:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <nav className="flex flex-row gap-2 md:flex-col">
              <Link
                href="/settings/profile"
                className="hover:bg-muted flex items-center gap-2 rounded-md py-2 text-sm transition-colors md:px-3"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:px-24">{children}</div>
      </div>
    </div>
  );
}
