'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customerFeedback, type Feedback } from "@/app/dashboard/data";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedbackDetailsDialog } from '@/components/dashboard/feedback-details-dialog';

function Rating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Customer Feedback
        </h1>
      </div>
       <Card>
      <CardHeader>
        <CardTitle>All Reviews</CardTitle>
        <CardDescription>
          A log of all feedback submitted by customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="hidden md:table-cell">Avg. Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerFeedback.map((feedback) => {
              const avgRating = (feedback.ratings.food + feedback.ratings.service + feedback.ratings.ambience + feedback.ratings.value) / 4;
              return (
              <TableRow key={feedback.id}>
                <TableCell>
                  <div className="font-medium">{feedback.customer}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{feedback.date}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <Rating rating={avgRating} />
                </TableCell>
                <TableCell>
                  <p className="max-w-[200px] lg:max-w-xs truncate">{feedback.comment}</p>
                </TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedFeedback(feedback)}>View</Button>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    {selectedFeedback && (
        <FeedbackDetailsDialog
            feedback={selectedFeedback}
            open={!!selectedFeedback}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSelectedFeedback(null);
                }
            }}
        />
    )}
    </div>
  );
}
