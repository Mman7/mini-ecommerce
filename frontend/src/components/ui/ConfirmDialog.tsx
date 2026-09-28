"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-foreground bg-surface-2! border-primary/20 border">
        <DialogHeader>
          <DialogTitle className="text-primary-soft">{title}</DialogTitle>
          <DialogDescription className="text-text-muted">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-surface-2!">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Go back
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
