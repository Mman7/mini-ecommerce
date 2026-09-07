"use client";

import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { AdminOrderList } from "../../../components/dashboard/AdminOrderList";
import {
  DashboardHeading,
  DashboardShell,
  StatCard,
} from "../../../components/dashboard";

type OrderStatistics = Record<string, number>;

export default function OrdersPage() {
  const [counts, setCounts] = useState<OrderStatistics>({});
  const all = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return (
    <DashboardShell activeSection="orders">
      <DashboardHeading
        eyebrow="Order operations"
        title="Orders"
        description="Track and manage customer orders from payment to delivery."
      />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard
          label="All Orders"
          value={String(all)}
          detail="Across all statuses"
          icon={<ShoppingCart />}
        />
        <StatCard
          label="Pending"
          value={String(counts.PENDING ?? 0)}
          detail="Awaiting payment"
          icon={<Clock3 />}
        />
        <StatCard
          label="Processing"
          value={String(counts.PROCESSING ?? 0)}
          detail="Being prepared"
          accent="cyan"
          icon={<PackageCheck />}
        />
        <StatCard
          label="Delivered"
          value={String(counts.DELIVERED ?? 0)}
          detail="Successfully completed"
          accent="green"
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Cancelled"
          value={String(counts.CANCELLED ?? 0)}
          detail="Not fulfilled"
          accent="pink"
          icon={<XCircle />}
        />
      </div>
      <AdminOrderList onStatisticsChange={setCounts} />
    </DashboardShell>
  );
}
