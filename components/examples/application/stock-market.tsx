"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, CircleDollarSignIcon } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const timePeriods = ["1W", "1M", "1Y"] as const;
type TimePeriod = (typeof timePeriods)[number];

export function StockMarket() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("1W");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <CircleDollarSignIcon className="text-muted-foreground size-4" />
          Stock Market
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex w-full">
          {timePeriods.map((period) => (
            <Button
              key={period}
              variant="outline"
              size="sm"
              className={cn(
                "flex-1 rounded-none shadow-none not-first:-ml-px first:rounded-l-md last:rounded-r-md focus-visible:z-10",
                timePeriod === period && "bg-muted"
              )}
              onClick={() => setTimePeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardContent>

      <CardContent className="flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="text-2xl font-medium tracking-tight tabular-nums">$120,748.00</span>
          <Badge
            variant="outline"
            className="border-chart-2/25 bg-chart-2/10 text-chart-2 tabular-nums"
          >
            +1.25%
            <ArrowUpRightIcon />
          </Badge>
        </div>
        <span className="text-muted-foreground text-xs font-medium">Shadcn Inc. (SDCN)</span>
      </CardContent>

      <CardContent>
        <StockMarketChart />
      </CardContent>

      <Separator />

      <CardContent className="grid grid-cols-[1fr_auto_1fr] gap-2.5">
        <div className="flex flex-1 flex-col items-center gap-1">
          <span className="text-muted-foreground text-xs">Market Cap</span>
          <span className="text-sm font-medium tabular-nums">$119K</span>
        </div>

        <Separator orientation="vertical" />

        <div className="flex flex-1 flex-col items-center gap-1">
          <span className="text-muted-foreground text-xs">Volume</span>
          <span className="text-sm font-medium tabular-nums">$122K</span>
        </div>
      </CardContent>
    </Card>
  );
}

const chartData = [
  { month: "January", stock: 186000 },
  { month: "February", stock: 301000 },
  { month: "March", stock: 237000 },
  { month: "April", stock: 73000 },
  { month: "May", stock: 209000 },
  { month: "June", stock: 214000 },
];

const chartConfig = {
  stock: {
    label: "Stock",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function StockMarketChart() {
  return (
    <ChartContainer config={chartConfig} className="h-50 w-full max-w-full overflow-hidden">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
        <Area
          dataKey="stock"
          type="linear"
          fill="var(--color-stock)"
          fillOpacity={0.4}
          stroke="var(--color-stock)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
