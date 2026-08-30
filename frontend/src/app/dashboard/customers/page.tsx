import { Download, Repeat2, UserPlus, Users, Crown } from "lucide-react";
import {
  DashboardHeading,
  DashboardPanel,
  DashboardShell,
  PanelHeading,
  StatCard,
  StatusPill,
  TableAction,
} from "../../../components/dashboard";

const customers = [
  ["Nur Aisyah", "aisyah@email.com", "8", "RM 892.00", "May 18, 2025", "VIP"],
  [
    "Lim Wei Xiang",
    "weixiang@gmail.com",
    "5",
    "RM 456.00",
    "May 17, 2025",
    "Regular",
  ],
  [
    "Siti Hawa",
    "siti.hawa@gmail.com",
    "12",
    "RM 1,246.00",
    "May 17, 2025",
    "VIP",
  ],
  [
    "Chong Yu En",
    "yu.en@gmail.com",
    "3",
    "RM 233.00",
    "May 17, 2025",
    "Regular",
  ],
  [
    "Aiman Hakimi",
    "aiman.hakimi@gmail.com",
    "7",
    "RM 678.00",
    "May 16, 2025",
    "Regular",
  ],
  [
    "Intan Sarah",
    "intan.sarah@gmail.com",
    "10",
    "RM 1,023.00",
    "May 16, 2025",
    "VIP",
  ],
];

const avatarColors = [
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
];

export default function DashboardCustomersPage() {
  return (
    <DashboardShell activeSection="customers">
      <DashboardHeading
        eyebrow="Your community"
        title="Customers"
        description="Manage your lovely collectors and understand who visits the atelier."
        action={
          <button
            type="button"
            className="meta-font text-text-muted hover:border-primary hover:text-primary-soft flex h-8 items-center gap-2 rounded-md border border-(--glass-border) px-3 text-xs"
          >
            <Download size={13} /> Export
          </button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Customers"
          value="1,245"
          detail="+15.7% this month"
          icon={<Users />}
        />
        <StatCard
          label="New Customers"
          value="156"
          detail="+12.3% this month"
          accent="pink"
          icon={<UserPlus />}
        />
        <StatCard
          label="Repeat Customers"
          value="689"
          detail="55.3% of total"
          accent="cyan"
          icon={<Repeat2 />}
        />
        <StatCard
          label="VIP Customers"
          value="72"
          detail="5.8% of total"
          icon={<Crown />}
        />
      </div>
      <DashboardPanel className="mt-3">
        <PanelHeading
          title="All Customers"
          action={
            <div className="flex gap-2">
              <input
                aria-label="Search customers"
                placeholder="Search customers..."
                className="meta-font bg-surface-2 text-foreground focus:border-primary hidden h-7 w-40 rounded border border-(--glass-border) px-2 text-xs outline-none placeholder:text-(--outline) sm:block"
              />
              <button
                type="button"
                className="meta-font text-text-muted hover:border-primary hover:text-primary-soft flex h-7 items-center gap-1.5 rounded border border-(--glass-border) px-2 text-xs"
              >
                <Download size={12} /> Export
              </button>
            </div>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="meta-font bg-surface-2/60 text-xs tracking-[0.08em] text-(--outline) uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="py-3 font-medium">Email</th>
                <th className="py-3 font-medium">Orders</th>
                <th className="py-3 font-medium">Total Spent</th>
                <th className="py-3 font-medium">Last Order</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 pr-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer[1]}
                  className="border-t border-(--glass-border)"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${avatarColors[index]}`}
                      >
                        {customer[0]
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </span>
                      <span className="text-foreground text-sm">
                        {customer[0]}
                      </span>
                    </div>
                  </td>
                  <td className="meta-font py-2.5 text-xs text-(--outline)">
                    {customer[1]}
                  </td>
                  <td className="meta-font text-text-muted py-2.5 text-xs">
                    {customer[2]}
                  </td>
                  <td className="meta-font text-text-muted py-2.5 text-xs">
                    {customer[3]}
                  </td>
                  <td className="meta-font py-2.5 text-xs text-(--outline)">
                    {customer[4]}
                  </td>
                  <td className="py-2.5">
                    <StatusPill status={customer[5]} />
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex justify-end">
                      <TableAction label={`View ${customer[0]}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="meta-font flex items-center justify-between border-t border-(--glass-border) px-4 py-3 text-xs text-(--outline)">
          <span>Showing 1 to 6 of 1,245 customers</span>
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
              21
            </button>
          </div>
        </div>
      </DashboardPanel>
    </DashboardShell>
  );
}
