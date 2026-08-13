"use client";

import {
  Archive,
  CheckCircle2,
  FolderTree,
  Search,
  Tags,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DashboardHeading,
  DashboardPanel,
  DashboardShell,
  PanelHeading,
  StatCard,
  StatusPill,
  TableAction,
} from "../../../components/dashboard";

type Category = {
  id: number;
  name: string;
  description: string;
  products: number;
  status: "Active" | "Inactive";
  createdAt: string;
};

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Plushies",
    description: "Soft companions and collectible plush toys.",
    products: 42,
    status: "Active",
    createdAt: "May 12, 2025",
  },
  {
    id: 2,
    name: "Home Decor",
    description: "Small objects that make a room feel like home.",
    products: 28,
    status: "Active",
    createdAt: "May 08, 2025",
  },
  {
    id: 3,
    name: "Collectibles",
    description: "Limited figures, blind boxes, and display pieces.",
    products: 35,
    status: "Active",
    createdAt: "May 05, 2025",
  },
  {
    id: 4,
    name: "Accessories",
    description: "Everyday details with a little extra charm.",
    products: 21,
    status: "Active",
    createdAt: "Apr 28, 2025",
  },
  {
    id: 5,
    name: "Stationery",
    description: "Paper goods, journals, and thoughtful desk treasures.",
    products: 16,
    status: "Inactive",
    createdAt: "Apr 18, 2025",
  },
];

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesQuery =
        !normalizedQuery ||
        category.name.toLowerCase().includes(normalizedQuery) ||
        category.description.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "All Status" || category.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [categories, query, statusFilter]);

  function toggleStatus(id: number) {
    setCategories((current) =>
      current.map((category) =>
        category.id === id
          ? {
              ...category,
              status: category.status === "Active" ? "Inactive" : "Active",
            }
          : category,
      ),
    );
  }

  return (
    <DashboardShell activeSection="categories">
      <DashboardHeading
        eyebrow="Catalog structure"
        title="Categories"
        description="Organize your treasures into clear little collections for every kind of collector."
        action={
          <Link
            href="/dashboard/categories/create"
            className="meta-font bg-primary hover:bg-primary-soft flex h-8 items-center gap-2 rounded-md px-3 text-xs font-semibold text-(--primary-ink) shadow-(--glow) transition"
          >
            <span className="text-base leading-none">+</span> Add Category
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Categories"
          value={String(categories.length)}
          detail="Across the atelier catalog"
          icon={<Tags />}
        />
        <StatCard
          label="Active"
          value={String(
            categories.filter((category) => category.status === "Active")
              .length,
          )}
          detail="Available for new products"
          accent="green"
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Inactive"
          value={String(
            categories.filter((category) => category.status === "Inactive")
              .length,
          )}
          detail="Hidden from new selections"
          accent="pink"
          icon={<Archive />}
        />
        <StatCard
          label="Products Organized"
          value={String(
            categories.reduce(
              (total, category) => total + category.products,
              0,
            ),
          )}
          detail="Assigned across categories"
          accent="cyan"
          icon={<FolderTree />}
        />
      </div>

      <DashboardPanel className="mt-3">
        <PanelHeading
          title="All Categories"
          action={
            <div className="flex gap-2">
              <div className="relative hidden sm:block">
                <Search
                  className="text-text-muted absolute top-1/2 left-2.5 -translate-y-1/2"
                  size={13}
                />
                <input
                  aria-label="Search categories"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search categories..."
                  className="meta-font bg-surface-2 text-foreground focus:border-primary h-7 w-44 rounded border border-(--glass-border) pl-8 text-xs outline-none placeholder:text-(--outline)"
                />
              </div>
              <select
                aria-label="Category status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="meta-font bg-surface-2 text-text-muted h-7 rounded border border-(--glass-border) px-2 text-xs outline-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="meta-font bg-surface-2/60 text-xs tracking-[0.08em] text-(--outline) uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="py-3 font-medium">Description</th>
                <th className="py-3 font-medium">Products</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Created At</th>
                <th className="py-3 pr-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-(--glass-border)"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary/15 text-primary-soft flex h-8 w-8 items-center justify-center rounded-md">
                        <Tags size={14} />
                      </span>
                      <span className="text-foreground text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-text-muted max-w-75 truncate py-3 text-xs">
                    {category.description}
                  </td>
                  <td className="meta-font text-text-muted py-3 text-xs">
                    {category.products}
                  </td>
                  <td className="py-3">
                    <StatusPill status={category.status} />
                  </td>
                  <td className="meta-font py-3 text-xs text-(--outline)">
                    {category.createdAt}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-1">
                      <TableAction
                        label={`Edit ${category.name}`}
                        href={`/dashboard/categories/${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/edit`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleStatus(category.id)}
                        title={
                          category.status === "Active"
                            ? "Deactivate category"
                            : "Activate category"
                        }
                        className="text-text-muted hover:border-primary hover:text-primary-soft flex h-6 items-center gap-1 rounded border border-(--glass-border) px-2 text-[10px] transition"
                      >
                        {category.status === "Active" ? (
                          <Trash2 size={11} />
                        ) : (
                          <CheckCircle2 size={11} />
                        )}
                        {category.status === "Active" ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="meta-font flex items-center justify-between border-t border-(--glass-border) px-4 py-3 text-xs text-(--outline)">
          <span>
            Showing {filteredCategories.length} of {categories.length}{" "}
            categories
          </span>
          <span className="text-text-muted">Category names must be unique</span>
        </div>
      </DashboardPanel>
    </DashboardShell>
  );
}
