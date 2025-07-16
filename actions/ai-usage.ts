"use server";

import { z } from "zod";
import { db } from "@/db";
import { aiUsage } from "@/db/schema";
import { eq, and, gte, count } from "drizzle-orm";
import cuid from "cuid";
import { ValidationError } from "@/types/errors";
import { getCurrentUserId } from "@/lib/shared";

const getDaysSinceEpoch = (daysAgo: number = 0) =>
  Math.floor(Date.now() / (24 * 60 * 60 * 1000)) - daysAgo;

// Schema for recording usage events (internal use - still tracks tokens)
const recordUsageSchema = z.object({
  promptTokens: z.number().min(0).default(0),
  completionTokens: z.number().min(0).default(0),
});

// Schema for timeframe validation
const timeframeSchema = z.union([z.literal("1d"), z.literal("7d"), z.literal("30d")]);

// Types
type Timeframe = z.infer<typeof timeframeSchema>;

// Simplified user-facing interface - only shows requests
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

// Constants
const MODEL_CONFIG = {
  id: "gemini-2.5-pro",
  name: "Gemini 2.5 Pro",
};

export async function recordAIUsage(input: { promptTokens?: number; completionTokens?: number }) {
  try {
    const userId = await getCurrentUserId();

    const validation = recordUsageSchema.safeParse(input);
    if (!validation.success) {
      throw new ValidationError("Invalid usage data", validation.error.format());
    }

    const { promptTokens, completionTokens } = validation.data;
    const now = new Date();
    const daysSinceEpoch = getDaysSinceEpoch(0);

    const usageId = cuid();

    const [insertedUsage] = await db
      .insert(aiUsage)
      .values({
        id: usageId,
        userId,
        modelId: MODEL_CONFIG.id,
        promptTokens: promptTokens.toString(),
        completionTokens: completionTokens.toString(),
        daysSinceEpoch: daysSinceEpoch.toString(),
        createdAt: now,
      })
      .returning();

    return insertedUsage;
  } catch (error) {
    console.error("Error recording usage:", error);
    throw error;
  }
}

export async function getMyUsageStats(timeframe: Timeframe): Promise<UsageStats> {
  try {
    const userId = await getCurrentUserId();

    const validation = timeframeSchema.safeParse(timeframe);
    if (!validation.success) {
      throw new ValidationError("Invalid timeframe");
    }

    const days = timeframe === "1d" ? 1 : timeframe === "7d" ? 7 : 30;
    const startDay = getDaysSinceEpoch(days);

    // Get user's events in time range
    const events = await db
      .select()
      .from(aiUsage)
      .where(and(eq(aiUsage.userId, userId), gte(aiUsage.daysSinceEpoch, startDay.toString())));

    return {
      requests: events.length,
      timeframe,
    };
  } catch (error) {
    console.error("Error getting usage stats:", error);
    throw error;
  }
}

export async function getMyAllTimeRequestCount(userId: string): Promise<number> {
  try {
    const result = await db
      .select({ count: count() })
      .from(aiUsage)
      .where(eq(aiUsage.userId, userId));

    return result[0]?.count ?? 0;
  } catch (error) {
    console.error("Error getting all-time request count:", error);
    throw error;
  }
}

export async function getMyUsageChartData(timeframe: Timeframe): Promise<ChartDataPoint[]> {
  try {
    const userId = await getCurrentUserId();

    const validation = timeframeSchema.safeParse(timeframe);
    if (!validation.success) {
      throw new ValidationError("Invalid timeframe");
    }

    // For 1d, we want hourly granularity
    if (timeframe === "1d") {
      const hours = 24;
      const startTime = Date.now() - hours * 60 * 60 * 1000;

      // Get user's events in the last 24 hours
      const events = await db
        .select()
        .from(aiUsage)
        .where(and(eq(aiUsage.userId, userId), gte(aiUsage.createdAt, new Date(startTime))));

      // Group by hour
      const chartData: ChartDataPoint[] = [];
      for (let i = hours - 1; i >= 0; i--) {
        const hourStart = Date.now() - i * 60 * 60 * 1000;
        const hourEnd = Date.now() - (i - 1) * 60 * 60 * 1000;
        const hourEvents = events.filter(
          (e) => e.createdAt.getTime() >= hourStart && e.createdAt.getTime() < hourEnd
        );

        const totalRequests = hourEvents.length;

        chartData.push({
          hoursSinceEpoch: Math.floor(hourStart / (60 * 60 * 1000)),
          date: new Date(hourStart).toISOString(),
          totalRequests,
        });
      }

      return chartData;
    }

    // Daily logic for 7d and 30d
    const days = timeframe === "7d" ? 7 : 30;
    const startDay = getDaysSinceEpoch(days);

    // Get user's events in time range
    const events = await db
      .select()
      .from(aiUsage)
      .where(and(eq(aiUsage.userId, userId), gte(aiUsage.daysSinceEpoch, startDay.toString())));

    // Group by day
    const chartData: ChartDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const daysSince = getDaysSinceEpoch(i);
      const dayEvents = events.filter((e) => parseInt(e.daysSinceEpoch) === daysSince);

      const totalRequests = dayEvents.length;

      chartData.push({
        daysSinceEpoch: daysSince,
        date: new Date(daysSince * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        totalRequests,
      });
    }

    return chartData;
  } catch (error) {
    console.error("Error getting usage chart data:", error);
    throw error;
  }
}

// Internal function for detailed usage (including tokens) - not exposed to users
export async function getDetailedUsageStats(timeframe: Timeframe): Promise<{
  requests: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  timeframe: Timeframe;
}> {
  try {
    const userId = await getCurrentUserId();

    const validation = timeframeSchema.safeParse(timeframe);
    if (!validation.success) {
      throw new ValidationError("Invalid timeframe");
    }

    const days = timeframe === "1d" ? 1 : timeframe === "7d" ? 7 : 30;
    const startDay = getDaysSinceEpoch(days);

    // Get user's events for the model
    const events = await db
      .select()
      .from(aiUsage)
      .where(
        and(
          eq(aiUsage.userId, userId),
          eq(aiUsage.modelId, MODEL_CONFIG.id),
          gte(aiUsage.daysSinceEpoch, startDay.toString())
        )
      );

    const requests = events.length;
    const promptTokens = events.reduce((sum, e) => sum + parseInt(e.promptTokens), 0);
    const completionTokens = events.reduce((sum, e) => sum + parseInt(e.completionTokens), 0);
    const totalTokens = promptTokens + completionTokens;

    return {
      requests,
      promptTokens,
      completionTokens,
      totalTokens,
      timeframe,
    };
  } catch (error) {
    console.error("Error getting detailed usage stats:", error);
    throw error;
  }
}
