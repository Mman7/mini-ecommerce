"use client";

import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  CircleDollarSign,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { AdminOrderList } from "../../../components/dashboard/AdminOrderList";
import { DashboardHeading, StatCard } from "../../../components/dashboard";

type OrderStatistics = Record<string, number>;

export default function OrdersPage() {
  const [counts, setCounts] = useState<OrderStatistics>({});
  const all = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return (
    <>
      <DashboardHeading
        eyebrow="Order operations"
        title="Orders"
        description="Track and manage customer orders from payment verification to final delivery."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
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
          label="Paid"
          value={String(counts.PAID ?? 0)}
          detail="Payment received"
          accent="green"
          icon={<CircleDollarSign />}
        />
        <StatCard
          label="Processing"
          value={String(counts.PROCESSING ?? 0)}
          detail="Atelier wrapping"
          accent="cyan"
          icon={<PackageCheck />}
        />
        <StatCard
          label="Delivered"
          value={String(counts.DELIVERED ?? 0)}
          detail="Successfully fulfilled"
          accent="green"
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Cancelled"
          value={String(counts.CANCELLED ?? 0)}
          detail="Refunded or void"
          accent="pink"
          icon={<XCircle />}
        />
      </div>
      <AdminOrderList onStatisticsChange={setCounts} />
    </>
  );
}
