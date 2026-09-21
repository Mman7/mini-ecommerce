import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductsBreadcrumb({ heading }: { heading: string }) {
  return (
    <Breadcrumb className="text-label-sm font-label-sm text-on-surface/50 mb-xs">
      <BreadcrumbList className="gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink
            className="title-font text-md font-semibold tracking-wide text-(--outline)"
            render={<Link href="/" />}
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            className="title-font text-md font-semibold tracking-wide text-(--outline)"
            render={<Link href="/products" />}
          >
            Shop
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="title-font text-primary-soft! text-md font-semibold tracking-wide">
            {heading}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
