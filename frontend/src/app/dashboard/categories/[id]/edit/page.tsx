import { CategoryEditor } from "@/src/components/dashboard/CategoryEditor";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  return <CategoryEditor mode="edit" categoryId={Number(id)} />;
}
