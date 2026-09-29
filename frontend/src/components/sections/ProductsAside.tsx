import type { Category } from "../../api/category.api";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import FiltersSidebar from "./FiltersSidebar";

export default function ProductsAside({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <>
      <div className="lg:hidden">
        <Drawer swipeDirection="left">
          <DrawerTrigger
            render={<Button variant="outline" className="gap-2" />}
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            Filters
          </DrawerTrigger>
          <DrawerContent className="bg-surface-1 w-[min(88vw,24rem)]">
            <DrawerHeader className="flex-row items-center justify-between border-b border-(--glass-border) px-5 py-3 text-left">
              <DrawerTitle className="sr-only">Product filters</DrawerTitle>
              <DrawerClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close product filters"
                  />
                }
              >
                <X aria-hidden="true" className="size-4" />
              </DrawerClose>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <FiltersSidebar categories={categories} idPrefix="mobile" />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <aside className="hidden lg:col-span-3 lg:block">
        <FiltersSidebar categories={categories} idPrefix="desktop" />
      </aside>
    </>
  );
}
