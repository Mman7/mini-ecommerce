"use client";

import { Button } from "../ui/Button";

export function LoadMore({
  loaded,
  total,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  loaded: number;
  total: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  const progress = total > 0 ? Math.min(100, (loaded / total) * 100) : 0;

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <p className="text-on-surface/75 meta-font text-sm">
        Showing <span className="text-on-surface font-semibold">{loaded}</span>{" "}
        of {total}
      </p>
      <div
        role="progressbar"
        aria-label="Products loaded"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={loaded}
        className="bg-surface-3 h-1 w-full max-w-md overflow-hidden rounded-full"
      >
        <div
          className="bg-primary h-full rounded-full transition-all duration-500 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
      {hasNextPage && (
        <Button
          variant="secondary"
          onClick={onLoadMore}
          disabled={isFetchingNextPage}
          className="w-full rounded-full min-[820px]:w-auto"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      )}
    </div>
  );
}
