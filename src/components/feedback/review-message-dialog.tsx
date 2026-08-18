"use client";

import { Dialog } from "@/components/ui/dialog";
import { StarRating } from "@/components/ui/star-rating";

type ReviewMessageDialogProps = {
  open: boolean;
  onClose: () => void;
  rating?: number;
  message: string;
};

export function ReviewMessageDialog({ open, onClose, rating, message }: ReviewMessageDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Review Message" maxWidth="max-w-md">
      <div className="space-y-4">
        {rating != null && rating > 0 ? (
          <StarRating rating={rating} size="size-5" />
        ) : null}
        <p className="text-[15px] leading-relaxed text-[#374151]">
          {message}
        </p>
      </div>
    </Dialog>
  );
}
