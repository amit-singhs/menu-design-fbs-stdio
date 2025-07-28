'use client';

import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Feedback } from '@/app/dashboard/data';
import { Star, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface FeedbackDetailsDialogProps {
  feedback: Feedback;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StarRatingDisplay: FC<{ rating: number; label: string }> = ({ rating, label }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="font-medium text-base">{label}</p>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-6 w-6',
              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
            )}
          />
        ))}
      </div>
    </div>
  );
};

export function FeedbackDetailsDialog({
  feedback,
  open,
  onOpenChange,
}: FeedbackDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Feedback Details</DialogTitle>
          <DialogDescription>
            From {feedback.customer} on {feedback.date}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <div className="space-y-4">
                <StarRatingDisplay rating={feedback.ratings.food} label="Food Quality" />
                <StarRatingDisplay rating={feedback.ratings.service} label="Service" />
                <StarRatingDisplay rating={feedback.ratings.ambience} label="Ambience" />
                <StarRatingDisplay rating={feedback.ratings.value} label="Value for Money" />
            </div>
            {feedback.comment && (
                <>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5"/> Comments</h4>
                        <p className="text-muted-foreground text-sm italic border-l-2 pl-4 ml-1">
                            "{feedback.comment}"
                        </p>
                    </div>
                </>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
