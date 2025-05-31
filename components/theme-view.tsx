"use client";

import { Footer } from "@/components/home/footer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useEditorStore } from "@/store/editor-store";
import type { Theme } from "@/types/theme";
import { Edit, Moon, MoreVertical, Share, Sun } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import ThemePreviewPanel from "./editor/theme-preview-panel";
import { Header } from "./header";

export default function ThemeView({ theme }: { theme: Theme }) {
  const { themeState, setThemeState, saveThemeCheckpoint, restoreThemeCheckpoint } =
    useEditorStore();
  const router = useRouter();
  const currentMode = themeState.currentMode;

  useEffect(() => {
    saveThemeCheckpoint();
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
    return () => {
      restoreThemeCheckpoint();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, saveThemeCheckpoint, setThemeState, restoreThemeCheckpoint]);

  if (!theme) {
    notFound();
  }

  const toggleTheme = () => {
    setThemeState({
      ...themeState,
      currentMode: currentMode === "light" ? "dark" : "light",
    });
  };

  const handleOpenInEditor = () => {
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
    saveThemeCheckpoint();
    router.push("/editor/theme");
  };

  const handleShare = () => {
    const url = `https://tweakcn.com/themes/${theme.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Theme URL copied to clipboard!",
    });
  };
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="bg-background text-foreground flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{theme.name}</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {currentMode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <Button variant="outline" size="default" onClick={handleShare}>
                <Share className="size-4" />
                Share
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2" onClick={handleOpenInEditor}>
                    <Edit className="size-4" />
                    Open in Editor
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="-m-4 mt-6 flex h-[min(80svh,900px)] flex-col">
            <ThemePreviewPanel styles={theme.styles} currentMode={currentMode} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
