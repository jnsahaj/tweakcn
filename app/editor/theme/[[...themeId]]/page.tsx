import { getEditorConfig } from "@/config/editors";
import { cn } from "@/lib/utils";
import Editor from "@/components/editor/editor";
import { Metadata } from "next";
import { Header } from "@/components/header";
import { getTheme } from "@/actions/themes";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { AuthDialogWrapper } from "@/components/auth-dialog-wrapper";

export const metadata: Metadata = {
  title: "tweakcn — Theme Generator for shadcn/ui",
  description:
    "Easily customize and preview your shadcn/ui theme with tweakcn. Modify colors, fonts, and styles in real-time.",
};

export default async function Component({
  params,
}: {
  params: Promise<{ themeId: string[] }>;
}) {
  const { themeId } = await params;
  const themePromise =
    themeId?.length > 0 ? getTheme(themeId?.[0]) : Promise.resolve(null);

  return (
    <>
      <div
        className={cn(
          "h-screen flex flex-col text-foreground bg-background transition-colors"
        )}
      >
        <AuthDialogWrapper />
        <Header />
        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<Loading />}>
            <Editor
              config={getEditorConfig("theme")}
              themePromise={themePromise}
            />
          </Suspense>
        </main>
      </div>
    </>
  );
}
