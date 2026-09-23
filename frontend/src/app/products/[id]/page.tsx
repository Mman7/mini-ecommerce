import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productApi } from "../../../api/product.api";
import ProductDetailInteractive from "../../../components/sections/ProductDetailInteractive";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ProductPageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await productApi.get(id);
    const description = product.description.slice(0, 160);
    const image = product.productImages[0]?.url;

    return {
      title: product.name,
      description,
      alternates: { canonical: `/products/${product.slug || id}` },
      openGraph: {
        type: "website",
        title: `${product.name} | Komorebi Gift Atelier`,
        description,
        ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | Komorebi Gift Atelier`,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: "Gift Details" };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product;
  try {
    product = await productApi.get(id);
  } catch (error) {
    if ((error as { status?: number }).status === 404) notFound();
    throw error;
  }

  const recommendations = (await productApi.recommended(5))
    .filter((item) => item.productId !== product.productId)
    .slice(0, 4);
  const category = product.category?.name ?? "Collectibles";

  return (
    <main className="mx-auto w-full max-w-360 px-4 pt-28 pb-16 sm:px-6 lg:px-16">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/products" />}>
              Shop
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link
                  href={`/products?categoryId=${product.category?.categoryId ?? ""}`}
                />
              }
            >
              {category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ProductDetailInteractive
        product={product}
        recommendations={recommendations}
      />
    </main>
  );
}
