import { ActivityFeed } from "@/components/examples/application/activity-feed";
import { MessagingPanel } from "@/components/examples/application/messaging";
import { StockMarket } from "@/components/examples/application/stock-market";
import { TickerStrip } from "@/components/examples/application/ticker";
import { Transactions } from "@/components/examples/application/transactions";

export default function ApplicationDemo() {
  return (
    <div className="flex flex-col gap-4 **:data-[slot=card]:shadow-none">
      <p className="text-muted-foreground text-xs">
        Application blocks from{" "}
        <a
          href="https://shadcncraft.com?atp=tweakcn&src=application-preview"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground underline underline-offset-4"
        >
          shadcncraft Pro
        </a>
      </p>

      <TickerStrip />

      <div className="grid items-start gap-4 @3xl:grid-cols-2 @6xl:grid-cols-3">
        <div className="flex flex-col gap-4">
          <StockMarket />
          <Transactions />
        </div>
        <ActivityFeed />
        <div className="@3xl:col-span-2 @6xl:col-span-1">
          <MessagingPanel />
        </div>
      </div>
    </div>
  );
}
