import Logo from "@/assets/logo.svg";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Sidebar } from "./components/sidebar";

const navItems = [
  { href: "/settings/themes", label: "Themes" },
  { href: "/settings/usage", label: "AI Usage" },
];

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex flex-col">
      {/* Header section with logo and user info */}
      <header className="mt-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center space-x-4 px-4">
          <Logo className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{session?.user?.name || "User"}</span>
            <span className="text-muted-foreground text-xs">{session?.user?.email || ""}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <Sidebar navItems={navItems} />
        <div className="flex-1 px-4 py-8 md:min-w-5xl">{children}</div>
      </main>
    </div>
  );
}
