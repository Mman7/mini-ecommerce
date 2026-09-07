import { DashboardShell } from "@/src/components/dashboard";
import { CategoryEditor } from "@/src/components/dashboard/CategoryEditor";

export default function CreateCategoryPage() {
  return (
    <DashboardShell activeSection="categories">
      <CategoryEditor mode="create" />
    </DashboardShell>
  );
}
