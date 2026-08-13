import {
  CalendarDays,
  CircleDollarSign,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import {
  DashboardHeading,
  DashboardPanel,
  DashboardShell,
  PanelHeading,
  StatCard,
  StatusPill,
} from "../../components/dashboard";

const topProducts = [
  {
    name: "Kawaii Bunny Plush",
    category: "Plushies",
    sold: "128 sold",
    price: "RM 89.00",
    image: "/homepage/pink-plush-bunny.jpg",
  },
  {
    name: "Sakura Dream Music Box",
    category: "Home Decor",
    sold: "96 sold",
    price: "RM 129.00",
    image: "/homepage/gift-wrap-display.jpg",
  },
  {
    name: "Komorebi Blind Box Series",
    category: "Collectibles",
    sold: "88 sold",
    price: "RM 69.00",
    image: "/homepage/acrylic-figurines-display.jpg",
  },
  {
    name: "Pastel Bear Keychain",
    category: "Accessories",
    sold: "76 sold",
    price: "RM 38.00",
    image: "/homepage/blue-lucky-cat-case.jpg",
  },
];

const recentOrders = [
  ["#ORD-250518-001", "Nur Aisyah", "May 18, 2025", "RM 166.00", "Paid"],
  ["#ORD-250518-002", "Lim Wei Xiang", "May 18, 2025", "RM 88.00", "Paid"],
  ["#ORD-250517-014", "Siti Hawa", "May 17, 2025", "RM 280.00", "Paid"],
];

export default function DashboardPage() {
  return (
    <DashboardShell activeSection="overview">
      <DashboardHeading
        eyebrow="Tuesday, May 18, 2025"
        title="Overview"
        description="Welcome back, Eric. Here is what is happening with your atelier today."
        action={
          <button
            type="button"
            className="meta-font bg-surface-1 text-text-muted hover:border-primary hover:text-primary-soft flex h-8 items-center gap-2 rounded-md border border-(--glass-border) px-3 text-xs transition"
          >
            <CalendarDays size={13} />
            May 12 - May 18, 2025
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value="RM 28,490.00"
          detail="+12.5% vs last week"
          icon={<CircleDollarSign />}
        />
        <StatCard
          label="Orders"
          value="324"
          detail="+8.3% vs last week"
          accent="pink"
          icon={<ShoppingCart />}
        />
        <StatCard
          label="Customers"
          value="1,245"
          detail="+15.7% vs last week"
          accent="cyan"
          icon={<Users />}
        />
        <StatCard
          label="Avg. Order Value"
          value="RM 87.93"
          detail="+5.2% vs last week"
          icon={<Sparkles />}
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,1fr)]">
        <DashboardPanel>
          <PanelHeading
            title="Revenue Overview"
            action={
              <select
                aria-label="Revenue period"
                className="meta-font bg-surface-2 text-text-muted rounded border border-(--glass-border) px-2 py-1 text-xs outline-none"
              >
                <option>This Week</option>
                <option>This Month</option>
              </select>
            }
          />
          <div className="bg-surface-3 m-4 h-44 rounded-md" />
        </DashboardPanel>

        <DashboardPanel>
          <PanelHeading
            title="Top Selling Products"
            action={
              <button
                type="button"
                className="meta-font bg-surface-2 text-text-muted hover:border-primary hover:text-primary-soft flex h-7 items-center rounded border border-(--glass-border) px-2 text-xs transition"
              >
                View all
              </button>
            }
          />
          <div className="divide-y divide-(--glass-border) px-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3 py-3">
                <span className="meta-font w-3 text-xs text-(--outline)">
                  {index + 1}
                </span>
                <div className="bg-surface-3 relative h-9 w-9 shrink-0 overflow-hidden rounded">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm">
                    {product.name}
                  </p>
                  <p className="meta-font mt-1 text-xs text-gray-400/80">
                    {product.sold}
                  </p>
                </div>
                <span className="meta-font text-text-muted text-xs">
                  {product.price}
                </span>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,1fr)]">
        <DashboardPanel>
          <PanelHeading
            title="Recent Orders"
            action={
              <button
                type="button"
                className="meta-font bg-surface-2 text-text-muted hover:border-primary hover:text-primary-soft flex h-7 items-center rounded border border-(--glass-border) px-2 text-xs transition"
              >
                View all
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead className="meta-font text-xs tracking-[0.08em] text-(--outline) uppercase">
                <tr className="border-b border-(--glass-border)">
                  <th className="px-4 py-2 font-medium">Order ID</th>
                  <th className="py-2 font-medium">Customer</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Amount</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order[0]}
                    className="border-b border-(--glass-border) last:border-0"
                  >
                    <td className="meta-font text-text-muted px-4 py-3 text-xs">
                      {order[0]}
                    </td>
                    <td className="text-foreground py-3 text-sm">{order[1]}</td>
                    <td className="meta-font py-3 text-xs text-(--outline)">
                      {order[2]}
                    </td>
                    <td className="meta-font text-text-muted py-3 text-xs">
                      {order[3]}
                    </td>
                    <td className="py-3">
                      <StatusPill status={order[4]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <PanelHeading
            title="Low Stock Alerts"
            action={
              <button
                type="button"
                className="meta-font bg-surface-2 text-text-muted hover:border-primary hover:text-primary-soft flex h-7 items-center rounded border border-(--glass-border) px-2 text-xs transition"
              >
                View all
              </button>
            }
          />
          <div className="divide-y divide-(--glass-border) px-4">
            {topProducts.slice(0, 3).map((product, index) => (
              <div key={product.name} className="flex items-center gap-3 py-3">
                <div className="bg-surface-3 relative h-8 w-8 overflow-hidden rounded">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
                <p className="text-foreground min-w-0 flex-1 truncate text-sm">
                  {product.name}
                </p>
                <span
                  className={`meta-font shrink-0 text-xs ${index === 0 ? "text-secondary" : "text-primary-soft"}`}
                >
                  Stock: {index === 0 ? 8 : index === 1 ? 12 : 4}
                </span>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  );
}
