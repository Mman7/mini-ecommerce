import {
  Boxes,
  Download,
  Package,
  PackageMinus,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DashboardHeading,
  DashboardPanel,
  DashboardShell,
  PanelHeading,
  StatCard,
  StatusPill,
  TableAction,
} from "../../../components/dashboard";

const products = [
  [
    "Kawaii Bunny Plush",
    "Plushies",
    "RM 89.00",
    "128",
    "Active",
    "May 12, 2025",
    "/homepage/white-plush-rabbit-on-shelf.png",
  ],
  [
    "Sakura Dream Music Box",
    "Home Decor",
    "RM 129.00",
    "12",
    "Low Stock",
    "May 10, 2025",
    "/homepage/komorebi-gift-atelier-wrapped-boxes.png",
  ],
  [
    "Komorebi Blind Box Series",
    "Collectibles",
    "RM 69.00",
    "0",
    "Out of Stock",
    "May 08, 2025",
    "/homepage/blue-maneki-neko-figurine-display-case.png",
  ],
  [
    "Pastel Bear Keychain",
    "Accessories",
    "RM 38.00",
    "45",
    "Active",
    "May 05, 2025",
    "/homepage/blue-maneki-neko-figurine-display-case.png",
  ],
  [
    "Yume Cat Night Light",
    "Home Decor",
    "RM 79.00",
    "22",
    "Low Stock",
    "May 03, 2025",
    "/homepage/lamp-on-desk-with-books-and-notebook.png",
  ],
  [
    "Floral Letter Set",
    "Stationery",
    "RM 32.00",
    "74",
    "Active",
    "Apr 29, 2025",
    "/homepage/komorebi-stationery-fountain-pen.png",
  ],
];

export default function DashboardProductsPage() {
  return (
    <DashboardShell activeSection="products">
      <DashboardHeading
        eyebrow="Catalog management"
        title="Products"
        description="Manage your collectible catalog and keep the atelier shelf beautifully stocked."
        action={
          <Link
            href="/dashboard/products/create"
            className="meta-font bg-primary hover:bg-primary-soft flex h-8 items-center gap-2 rounded-md px-3 text-xs font-semibold text-(--primary-ink) shadow-(--glow) transition"
          >
            <Plus size={14} /> Add Product
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value="156"
          detail="+6 this month"
          icon={<Package />}
        />
        <StatCard
          label="Active"
          value="142"
          detail="90.3% of total"
          accent="green"
          icon={<Boxes />}
        />
        <StatCard
          label="Out of Stock"
          value="4"
          detail="2.6% of total"
          accent="pink"
          icon={<Boxes />}
        />
        <StatCard
          label="Low Stock"
          value="10"
          detail="6.4% of total"
          icon={<PackageMinus />}
        />
      </div>

      <DashboardPanel className="mt-3">
        <PanelHeading
          title="All Products"
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Filter products"
                className="text-text-muted hover:border-primary hover:text-primary-soft flex h-7 items-center gap-1.5 rounded border border-(--glass-border) px-2 text-xs"
              >
                <Download size={12} /> Export
              </button>
              <button
                type="button"
                aria-label="Filter products"
                className="text-text-muted hover:border-primary hover:text-primary-soft flex h-7 items-center gap-1.5 rounded border border-(--glass-border) px-2 text-xs"
              >
                <SlidersHorizontal size={12} /> Filter
              </button>
            </div>
          }
        />
        <div className="flex flex-col gap-2 border-b border-(--glass-border) p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-3 -translate-y-1/2 text-(--outline)"
              size={13}
            />
            <input
              aria-label="Search products"
              placeholder="Search products..."
              className="meta-font bg-surface-2 text-foreground focus:border-primary h-8 w-full rounded border border-(--glass-border) pl-8 text-xs outline-none placeholder:text-(--outline)"
            />
          </div>
          <select
            aria-label="Product category"
            className="meta-font bg-surface-2 text-text-muted h-8 rounded border border-(--glass-border) px-2 text-xs outline-none"
          >
            <option>All Categories</option>
            <option>Plushies</option>
            <option>Home Decor</option>
          </select>
          <select
            aria-label="Product status"
            className="meta-font bg-surface-2 text-text-muted h-8 rounded border border-(--glass-border) px-2 text-xs outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Low Stock</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="meta-font bg-surface-2/60 text-xs tracking-[0.08em] text-(--outline) uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="py-3 font-medium">Category</th>
                <th className="py-3 font-medium">Price</th>
                <th className="py-3 font-medium">Stock</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Created At</th>
                <th className="py-3 pr-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product[0]}
                  className="border-t border-(--glass-border)"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="bg-surface-3 relative h-9 w-9 shrink-0 overflow-hidden rounded">
                        <Image
                          src={product[6]}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-foreground text-sm">
                        {product[0]}
                      </span>
                    </div>
                  </td>
                  <td className="meta-font py-2.5 text-xs text-(--outline)">
                    {product[1]}
                  </td>
                  <td className="meta-font text-text-muted py-2.5 text-xs">
                    {product[2]}
                  </td>
                  <td
                    className={`meta-font py-2.5 text-xs ${product[3] === "0" ? "text-secondary" : "text-text-muted"}`}
                  >
                    {product[3]}
                  </td>
                  <td className="py-2.5">
                    <StatusPill status={product[4]} />
                  </td>
                  <td className="meta-font py-2.5 text-xs text-(--outline)">
                    {product[5]}
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex justify-end gap-1">
                      <TableAction
                        label={`Edit ${product[0]}`}
                        href={`/dashboard/products/${product[0].toLowerCase().replace(/[^a-z0-9]+/g, "-")}/edit`}
                      />
                      <TableAction label={`More actions for ${product[0]}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="meta-font flex items-center justify-between border-t border-(--glass-border) px-4 py-3 text-xs text-(--outline)">
          <span>Showing 1 to 6 of 156 products</span>
          <div className="flex gap-1">
            <button
              type="button"
              className="text-text-muted h-6 w-6 rounded border border-(--glass-border)"
            >
              1
            </button>
            <button
              type="button"
              className="h-6 w-6 rounded text-(--outline) hover:bg-(--glass-bg)"
            >
              2
            </button>
            <button
              type="button"
              className="h-6 w-6 rounded text-(--outline) hover:bg-(--glass-bg)"
            >
              3
            </button>
            <span className="px-1 py-1">...</span>
            <button
              type="button"
              className="h-6 w-6 rounded text-(--outline) hover:bg-(--glass-bg)"
            >
              16
            </button>
          </div>
        </div>
      </DashboardPanel>
    </DashboardShell>
  );
}
