import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  PackageCheck,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import {
  DashboardHeading,
  DashboardPanel,
  DashboardShell,
  PanelHeading,
  StatCard,
  StatusPill,
  TableAction,
} from "../../../components/dashboard";

const orders = [
  [
    "#ORD-250518-001",
    "Nur Aisyah",
    "May 18, 2025",
    "2 items",
    "RM 166.00",
    "Processing",
    "Paid",
  ],
  [
    "#ORD-250518-002",
    "Lim Wei Xiang",
    "May 18, 2025",
    "1 item",
    "RM 88.00",
    "Pending",
    "Paid",
  ],
  [
    "#ORD-250517-014",
    "Siti Hawa",
    "May 17, 2025",
    "3 items",
    "RM 280.00",
    "Shipped",
    "Paid",
  ],
  [
    "#ORD-250517-013",
    "Chong Yu En",
    "May 17, 2025",
    "1 item",
    "RM 78.00",
    "Delivered",
    "Paid",
  ],
  [
    "#ORD-250516-006",
    "Aiman Hakimi",
    "May 16, 2025",
    "2 items",
    "RM 178.00",
    "Delivered",
    "Paid",
  ],
  [
    "#ORD-250516-007",
    "Intan Sarah",
    "May 16, 2025",
    "4 items",
    "RM 312.00",
    "Cancelled",
    "Refunded",
  ],
];

export default function DashboardOrdersPage() {
  return (
    <DashboardShell activeSection="orders">
      <DashboardHeading
        eyebrow="Order operations"
        title="Orders"
        description="Track and manage customer orders from payment to delivery."
        action={
          <button
            type="button"
            className="meta-font text-text-muted hover:border-primary hover:text-primary-soft flex h-8 items-center gap-2 rounded-md border border-(--glass-border) px-3 text-xs"
          >
            <Download size={13} /> Export
          </button>
        }
      />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard
          label="All Orders"
          value="324"
          detail="This week"
          icon={<ShoppingCart />}
        />
        <StatCard
          label="Pending"
          value="28"
          detail="8.6% of total"
          icon={<Clock3 />}
        />
        <StatCard
          label="Processing"
          value="96"
          detail="29.6% of total"
          accent="cyan"
          icon={<PackageCheck />}
        />
        <StatCard
          label="Delivered"
          value="40"
          detail="12.3% of total"
          accent="green"
          icon={<CheckCircle2 />}
        />
        <StatCard
          label="Cancelled"
          value="4"
          detail="1.2% of total"
          accent="pink"
          icon={<XCircle />}
        />
      </div>
      <DashboardPanel className="mt-3">
        <PanelHeading
          title="All Orders"
          action={
            <div className="flex gap-2">
              <select
                aria-label="Order status"
                className="meta-font bg-surface-2 text-text-muted h-7 rounded border border-(--glass-border) px-2 text-xs outline-none"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Delivered</option>
              </select>
              <select
                aria-label="Order date range"
                className="meta-font bg-surface-2 text-text-muted hidden h-7 rounded border border-(--glass-border) px-2 text-xs outline-none sm:block"
              >
                <option>May 12 - May 18, 2025</option>
              </select>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead className="meta-font bg-surface-2/60 text-xs tracking-[0.08em] text-(--outline) uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="py-3 font-medium">Customer</th>
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 font-medium">Items</th>
                <th className="py-3 font-medium">Amount</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Payment</th>
                <th className="py-3 pr-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order[0]} className="border-t border-(--glass-border)">
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
                  <td className="meta-font text-text-muted py-3 text-xs">
                    {order[4]}
                  </td>
                  <td className="py-3">
                    <StatusPill status={order[5]} />
                  </td>
                  <td className="py-3">
                    <StatusPill status={order[6]} />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end">
                      <TableAction label={`View ${order[0]}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="meta-font flex items-center justify-between border-t border-(--glass-border) px-4 py-3 text-xs text-(--outline)">
          <span>Showing 1 to 6 of 324 orders</span>
          <div className="flex gap-1">
            <button
              type="button"
              className="border-primary bg-primary/15 text-primary-soft h-6 w-6 rounded border"
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
      <div className="mt-3 flex items-center gap-2 text-xs text-(--outline)">
        <CreditCard size={13} className="text-tertiary" /> Payment status is
        synced with the checkout service.
      </div>
    </DashboardShell>
  );
}
