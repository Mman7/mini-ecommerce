"use client";

import { Archive, CheckCircle2, FolderTree, Plus, Tags } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminCategoryList } from "../../../components/dashboard/AdminCategoryList";
import { DashboardHeading, StatCard } from "../../../components/dashboard";

type CategoryStatistics = {
  all: number;
  active: number;
  products: number;
};

export default function CategoriesPage() {
  const [stats, setStats] = useState<CategoryStatistics>({
    all: 0,
    active: 0,
    products: 0,
  });

  return (
    <>
      <DashboardHeading
        eyebrow="Product organization"
        title="Categories"
        description="Organize your products into collections."
        action={
          <Link
            href="/dashboard/categories/create"
            className="meta-font bg-primary text-primary-foreground flex h-8 items-center gap-2 rounded-md px-3 text-xs font-semibold"
          >
            <Plus size={14} /> Add Category
          </Link>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="All Categories"
          value={String(stats.all)}
          detail="Catalog groups"
          icon={<Tags />}
        />
        <StatCard
          label="Active"
          value={String(stats.active)}
          detail="Currently enabled"
          accent="green"
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Inactive"
          value={String(stats.all - stats.active)}
          detail="Currently disabled"
          accent="pink"
          icon={<Archive />}
        />
        <StatCard
          label="Products Organized"
          value={String(stats.products)}
          detail="Across loaded categories"
          accent="cyan"
          icon={<FolderTree />}
        />
      </div>
      <AdminCategoryList onStatisticsChange={setStats} />
    </>
  );
}
