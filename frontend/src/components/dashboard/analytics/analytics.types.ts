import type { ReactNode } from "react";
import type { DashboardOverview } from "@/src/api/dashboard.api";

export type AnalyticsRange = "1d" | "7d" | "30d" | "90d";

export type AnalyticsTrendPoint = DashboardOverview["revenueTrend"][number] & {
  label: string;
  index: number;
  orders: number;
};

export type AnalyticsIcon = ReactNode;
