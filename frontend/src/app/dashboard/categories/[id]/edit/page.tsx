import { CategoryEditor } from "../../../../../components/dashboard/CategoryEditor";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  await params;
  return <CategoryEditor mode="edit" />;
}
