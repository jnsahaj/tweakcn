"use client";

import DiscordIcon from "@/assets/discord.svg";
import GitHubIcon from "@/assets/github.svg";
import Logo from "@/assets/logo.svg";
import TwitterIcon from "@/assets/twitter.svg";
import { SocialLink } from "@/components/social-link";
import { Separator } from "@/components/ui/separator";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { useGithubStars } from "@/hooks/use-github-stars";
import { formatCompactNumber } from "@/utils/format";
import Link from "next/link";

export function Header() {
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");

  return (
    <header className="border-b">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-6" title="tweakcn" />
            <span className="hidden font-bold md:block">tweakcn</span>
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
            <div className="hidden items-center gap-3.5 md:flex">
              <SocialLink
                href="https://github.com/sponsors/jnsahaj"
                className="flex items-center gap-1.5 rounded-md border px-2 py-1 transition-colors hover:border-pink-500 hover:text-pink-500"
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
