"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  PaperclipIcon,
  SearchIcon,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

type ActivityType = "file-upload" | "task-completed" | "event-scheduled";

type ActivityItem = {
  type: ActivityType;
  actor: { name: string; avatar?: string };
  action: string;
  target: string;
  badge: string;
  timestamp: string;
};

const activityIcons: Record<ActivityType, LucideIcon> = {
  "file-upload": PaperclipIcon,
  "task-completed": CheckCircle2Icon,
  "event-scheduled": CalendarDaysIcon,
};

const activityItems: ActivityItem[] = [
  {
    type: "event-scheduled",
    actor: { name: "Nathaniel Caldwell" },
    action: "booked a call tomorrow at",
    target: "4:00 PM - 5:00 PM",
    badge: "Team meeting",
    timestamp: "2 mins ago",
  },
  {
    type: "task-completed",
    actor: { name: "Lucy Aniston", avatar: "/examples/avatars/person-5.webp" },
    action: "completed",
    target: "Sprint 12",
    badge: "All tasks completed",
    timestamp: "9 mins ago",
  },
  {
    type: "file-upload",
    actor: { name: "Lucy Aniston", avatar: "/examples/avatars/person-5.webp" },
    action: "uploaded a file to",
    target: "Legal folder",
    badge: "Report.pdf",
    timestamp: "10 mins ago",
  },
  {
    type: "file-upload",
    actor: { name: "Jackson Lee", avatar: "/examples/avatars/person-4.webp" },
    action: "uploaded a file to",
    target: "Design assets",
    badge: "Homepage_v3.fig",
    timestamp: "24 mins ago",
  },
  {
    type: "event-scheduled",
    actor: { name: "Emma Wilson", avatar: "/examples/avatars/person-3.webp" },
    action: "scheduled a review on Friday at",
    target: "10:00 AM - 11:00 AM",
    badge: "Quarterly review",
    timestamp: "1 hour ago",
  },
  {
    type: "task-completed",
    actor: { name: "William Kim", avatar: "/examples/avatars/person-2.webp" },
    action: "completed",
    target: "Onboarding flow",
    badge: "All tasks completed",
    timestamp: "2 hours ago",
  },
];

const typeFilters = [
  { value: "all", label: "All", types: ["file-upload", "task-completed", "event-scheduled"] },
  { value: "tasks", label: "Tasks", types: ["task-completed", "file-upload"] },
  { value: "meetings", label: "Meetings", types: ["event-scheduled"] },
] as const;

export function ActivityFeed() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const filter = typeFilters.find((typeFilter) => typeFilter.value === selectedFilter);
    return activityItems.filter(
      (item) =>
        (filter?.types as readonly ActivityType[] | undefined)?.includes(item.type) &&
        item.actor.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [selectedFilter, search]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="flex w-full">
          {typeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              size="sm"
              className={cn(
                "flex-1 rounded-none shadow-none not-first:-ml-px first:rounded-l-md last:rounded-r-md focus-visible:z-10",
                selectedFilter === filter.value && "bg-muted"
              )}
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </CardContent>

      <CardContent className="flex flex-col">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => <ActivityFeedItem key={index} {...item} />)
        ) : (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <SearchIcon className="text-muted-foreground size-5" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Activity feed is empty</p>
              <p className="text-muted-foreground text-sm text-balance">
                No activities found matching your search, try adjusting your filters.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSearch("")}>
              Reset search
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityFeedItem({ type, actor, action, target, badge, timestamp }: ActivityItem) {
  const Icon = activityIcons[type];
  const initials = actor.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="group/activity-feed-item relative flex gap-3">
      <div className="relative flex shrink-0 flex-col items-center gap-1">
        <Avatar>
          <AvatarImage src={actor.avatar} alt={actor.name} className="object-cover" />
          <AvatarFallback className="uppercase">{initials}</AvatarFallback>
        </Avatar>
        <Separator
          orientation="vertical"
          className="mx-auto flex-1 group-last/activity-feed-item:hidden"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-8 group-last/activity-feed-item:pb-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-sm font-medium">{actor.name}</span>
            <span className="text-muted-foreground shrink-0 text-xs">{timestamp}</span>
          </div>
          <span className="text-muted-foreground text-sm text-pretty">
            {action} <span className="text-foreground">{target}</span>
          </span>
        </div>

        <Badge variant="outline" className="text-muted-foreground max-w-full">
          <Icon className={cn(type === "task-completed" && "text-chart-2")} />
          <span className="truncate">{badge}</span>
        </Badge>
      </div>
    </div>
  );
}
