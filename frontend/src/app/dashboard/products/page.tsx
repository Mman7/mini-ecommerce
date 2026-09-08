"use client";

import { Boxes, Package, PackageMinus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminProductList } from "../../../components/dashboard/AdminProductList";
import { DashboardHeading, StatCard } from "../../../components/dashboard";

type ProductStatistics = {
  all: number;
  active: number;
  outOfStock: number;
  lowStock: number;
};

export default function ProductsPage() {
  const [stats, setStats] = useState<ProductStatistics>({
    all: 0,
    active: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  return (
    <>
      <DashboardHeading
        eyebrow="Product catalog"
        title="Products"
        description="Manage your product catalog, pricing, and inventory."
        action={
          <Link
            href="/dashboard/products/create"
            className="meta-font bg-primary text-primary-foreground flex h-8 items-center gap-2 rounded-md px-3 text-xs font-semibold"
          >
            <Plus size={14} /> Add Product
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="All Products"
          value={String(stats.all)}
          detail="Catalog total"
          icon={<Package />}
        />
        <StatCard
          label="Active"
          value={String(stats.active)}
          detail="Currently visible"
          accent="green"
          icon={<Boxes />}
        />
        <StatCard
          label="Out of Stock"
          value={String(stats.outOfStock)}
          detail="Needs replenishment"
          accent="pink"
          icon={<Boxes />}
        />
        <StatCard
          label="Low Stock"
          value={String(stats.lowStock)}
          detail="Below reorder level"
          icon={<PackageMinus />}
        />
      </div>
      <AdminProductList onStatisticsChange={setStats} />
    </>
  );
}
