"use client";

import Link from "next/link";
import GitHubIcon from "@/assets/github.svg";
import TwitterIcon from "@/assets/twitter.svg";
import DiscordIcon from "@/assets/discord.svg";
import Logo from "@/assets/logo.svg";
import { useGithubStars } from "@/hooks/use-github-stars";
import { SocialLink } from "@/components/social-link";
import { Separator } from "@/components/ui/separator";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { formatCompactNumber } from "@/utils/format";

export function Header() {
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");

  return (
    <header className="border-b">
      <div className="p-4 flex items-center gap-2 justify-between">
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
            {stargazersCount > 0 && formatCompactNumber(stargazersCount)}
          </SocialLink>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex items-center gap-3.5">
            <div className="hidden md:flex items-center gap-3.5">
              <SocialLink
                href="https://github.com/sponsors/jnsahaj"
                className="flex items-center gap-1.5 px-2 py-1 rounded-md border hover:border-pink-500 hover:text-pink-500 transition-colors"
              >
                <span className="text-sm font-medium">Sponsor</span>
              </SocialLink>
              <SocialLink href="https://discord.gg/Phs4u2NM3n">
                <DiscordIcon className="size-5" />
              </SocialLink>
            </div>
            <SocialLink href="https://x.com/iamsahaj_xyz">
              <TwitterIcon className="size-4" />
            </SocialLink>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
