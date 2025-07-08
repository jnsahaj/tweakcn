import Logo from "@/assets/logo.svg";
import { SettingsSidebar } from "./components/settings-sidebar";
import { UserInfo } from "./components/user-info";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      {/* Header section with logo and user info */}
      <header className="flex h-24 items-center">
        <div className="mx-auto flex w-full max-w-7xl items-center space-x-4 px-4 md:px-6">
          <Logo className="size-8" />
          <UserInfo />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-16 md:flex-row md:px-6">
        <SettingsSidebar />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
