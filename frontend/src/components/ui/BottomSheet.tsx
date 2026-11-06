"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function BottomSheet({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="bg-surface-1/95 relative flex max-h-[85vh] w-full flex-col rounded-t-2xl border-t border-white/10 backdrop-blur-xl focus:outline-none"
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-white/25"
        />
        <h2 className="heading-font px-5 pt-3 pb-2 text-lg font-semibold">
          {title}
        </h2>
        <div className="overflow-y-auto px-5 pb-4">{children}</div>
        {footer && (
          <div className="flex gap-3 border-t border-white/10 px-5 py-4">
            {footer}
          </div>
        )}
      </section>
    </div>,
    document.body,
  );
}
