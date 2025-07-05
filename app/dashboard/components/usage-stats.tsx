"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";
import { getMyUsageStats, getMyUsageChartData } from "@/actions/ai-usage";

type Timeframe = "1d" | "7d" | "30d";

interface UsageStats {
  requests: number;
  timeframe: Timeframe;
}

interface ChartDataPoint {
  daysSinceEpoch?: number;
  hoursSinceEpoch?: number;
  date: string;
  totalRequests: number;
}

const timeframeLabels = {
  "1d": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

const chartConfig = {
  totalRequests: {
    label: "Requests",
    color: "var(--primary)",
  },
};

export function UsageStats() {
  const [timeframe, setTimeframe] = useState<Timeframe>("7d");
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, chartDataResponse] = await Promise.all([
          getMyUsageStats(timeframe),
          getMyUsageChartData(timeframe),
        ]);
        setStats(statsData);
        setChartData(chartDataResponse);
      } catch (error) {
        console.error("Error fetching usage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const formatDate = (dateString: string, timeframe: Timeframe) => {
    const date = new Date(dateString);
    if (timeframe === "1d") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">AI Usage</CardTitle>
          <CardDescription>Track your AI theme generation requests</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="text-muted-foreground h-4 w-4" />
          <Select value={timeframe} onValueChange={(value: Timeframe) => setTimeframe(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center">
            <div className="text-muted-foreground text-sm">Loading...</div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center space-x-2">
              <div className="text-2xl font-bold">{stats?.requests || 0}</div>
              <div className="text-muted-foreground text-sm">
                requests in {timeframeLabels[timeframe].toLowerCase()}
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value, timeframe)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => formatDate(value, timeframe)}
                />
                <Bar
                  dataKey="totalRequests"
                  fill="var(--color-totalRequests)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
