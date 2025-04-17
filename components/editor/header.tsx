"use client";

import Link from "next/link";
import { Moon, Sun, Heart } from "lucide-react";
import GitHubIcon from "@/assets/github.svg";
import TwitterIcon from "@/assets/twitter.svg";
import DiscordIcon from "@/assets/discord.svg";
import { useTheme } from "@/components/theme-provider";
import Logo from "@/assets/logo.svg";
import { useGithubStars } from "@/hooks/use-github-stars";
import { SocialLink } from "@/components/social-link";
import { Separator } from "@/components/ui/separator";
import * as SwitchPrimitives from "@radix-ui/react-switch";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <header className="border-b">
      <div className="px-2 md:px-4 py-4 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-6" title="tweakcn" />
            <span className="font-bold hidden md:block">tweakcn</span>
          </Link>
        </div>
        <div className="flex items-center gap-3.5">
          <SocialLink
            href="https://github.com/jnsahaj/tweakcn"
            className="flex items-center gap-2 text-sm font-bold"
          >
            <GitHubIcon className="size-4" />
            {stargazersCount > 0 && stargazersCount.toLocaleString()}
          </SocialLink>
          <Separator orientation="vertical" className="h-5" />
          <div className="hidden md:flex items-center gap-3.5">
            <SocialLink
              href="https://github.com/sponsors/jnsahaj"
              className="flex items-center gap-1.5 px-2 py-1 rounded-md border hover:border-pink-500 hover:text-pink-500 transition-colors"
            >
              <Heart className="size-4" strokeWidth={2.5} />
              <span className="text-sm font-medium">Support</span>
            </SocialLink>
            <SocialLink href="https://discord.gg/Phs4u2NM3n">
              <DiscordIcon className="size-5" />
            </SocialLink>
          </div>
          <SocialLink href="https://x.com/iamsahaj_xyz">
            <TwitterIcon className="size-4" />
          </SocialLink>
          <Separator orientation="vertical" className="h-5" />
          <SwitchPrimitives.Root
            checked={theme === "dark"}
            onClick={handleThemeToggle}
            className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent data-[state=unchecked]:bg-input"
          >
            <SwitchPrimitives.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 flex items-center justify-center">
              {theme === "dark" ? (
                <Moon className="size-3" />
              ) : (
                <Sun className="size-3" />
              )}
            </SwitchPrimitives.Thumb>
          </SwitchPrimitives.Root>
        </div>
      </div>
    </header>
  );
}
