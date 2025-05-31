"use client";

import { Circle, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function GithubCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle>tweakcn</CardTitle>
            <CardDescription>
              A visual editor for shadcn/ui components with beautiful themes. Accessible.
              Customizable. Open Source.
            </CardDescription>
          </div>
          <div className="bg-secondary text-secondary-foreground flex min-w-20 shrink-0 items-center space-x-1 rounded-md">
            <Link href="https://github.com/jnsahaj/tweakcn">
              <Button variant="secondary" className="flex items-center gap-2 px-3 shadow-none">
                <Star />
                Star
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex space-x-4 text-sm">
          <div className="flex items-center">
            <Circle className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            TypeScript
          </div>
          <div className="flex items-center">
            <Star className="mr-1 h-3 w-3" />
            20k
          </div>
          <div>Updated April 2023</div>
        </div>
      </CardContent>
    </Card>
  );
}
