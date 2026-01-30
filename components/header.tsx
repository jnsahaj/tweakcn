"use client";

import DiscordIcon from "@/assets/discord.svg";
import FigmaIcon from "@/assets/figma.svg";
import GitHubIcon from "@/assets/github.svg";
import Logo from "@/assets/logo.svg";
import TwitterIcon from "@/assets/twitter.svg";
import { FigmaExportDialog } from "@/components/figma-export-dialog";
import { SocialLink } from "@/components/social-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { useGithubStars } from "@/hooks/use-github-stars";
import { formatCompactNumber } from "@/utils/format";
import Link from "next/link";
import { useState } from "react";
import { GetProCTA } from "./get-pro-cta";
import { CmdK } from "./cmdk";

export function Header() {
  const { stargazersCount } = useGithubStars("jnsahaj", "tweakcn");
  const [figmaDialogOpen, setFigmaDialogOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-6" title="tweakcn" />
            <span className="hidden font-bold sm:block">tweakcn</span>
          </Link>
        </div>
        <div className="flex items-center gap-3.5">
          <GetProCTA className="h-8" />
          <CmdK />
          <Separator orientation="vertical" className="hidden h-8 md:block" />

          <SocialLink
            href="https://github.com/jnsahaj/tweakcn"
            className="hidden items-center gap-2 text-sm font-bold sm:flex"
          >
            <GitHubIcon className="size-4" />
            {stargazersCount > 0 && formatCompactNumber(stargazersCount)}
          </SocialLink>
          <Separator orientation="vertical" className="hidden h-8 md:block" />
          <div className="hidden items-center gap-3.5 md:flex">
            <div className="hidden items-center gap-3.5 md:flex">
              <SocialLink href="https://discord.gg/Phs4u2NM3n">
                <DiscordIcon className="size-5" />
              </SocialLink>
            </div>
            <SocialLink href="https://x.com/iamsahaj_xyz">
              <TwitterIcon className="size-4" />
            </SocialLink>
          </div>
          <Separator orientation="vertical" className="hidden h-8 md:block" />
          <Button
            onClick={() => setFigmaDialogOpen(true)}
            variant="outline"
            className="flex h-8 items-center gap-2"
          >
            <FigmaIcon className="size-4" aria-hidden="true" />
            <span className="hidden lg:block">Export to Figma</span>
            <span className="sr-only">Export to Figma</span>
          </Button>
          <UserProfileDropdown />
        </div>
      </div>

      <FigmaExportDialog open={figmaDialogOpen} onOpenChange={setFigmaDialogOpen} />
    </header>
  );
}
