import {
  DashboardHeading,
  DashboardPanel,
  DashboardShell,
  PanelHeading,
} from "../../../components/dashboard";

export default function DashboardAnalyticsPage() {
  return (
    <DashboardShell activeSection="analytics">
      <DashboardHeading
        eyebrow="Performance workspace"
        title="Analytics"
        description="Detailed atelier performance insights will appear here."
      />
      <DashboardPanel>
        <PanelHeading title="Analytics Overview" />
        <div className="bg-surface-3 m-4 h-72 rounded-md" />
      </DashboardPanel>
    </DashboardShell>
  );
}
