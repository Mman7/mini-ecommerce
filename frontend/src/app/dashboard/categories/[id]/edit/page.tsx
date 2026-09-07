import { CategoryEditor } from "@/src/components/dashboard/CategoryEditor";
import { DashboardShell } from "@/src/components/dashboard";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  return (
    <DashboardShell activeSection="categories">
      <CategoryEditor mode="edit" categoryId={Number(id)} />
    </DashboardShell>
  );
}
