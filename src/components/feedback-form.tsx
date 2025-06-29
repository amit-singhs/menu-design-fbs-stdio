
'use client';

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Star, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating: FC<StarRatingProps> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-8 w-8 cursor-pointer transition-all duration-200',
            (hoverRating || rating) >= star
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 dark:text-gray-600',
            'hover:scale-125'
          )}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        />
      ))}
    </div>
  );
};


interface FeedbackFormProps {
  orderId: string;
  onFeedbackSubmitted: () => void;
}

export const FeedbackForm: FC<FeedbackFormProps> = ({ orderId, onFeedbackSubmitted }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [ambienceRating, setAmbienceRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [comments, setComments] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodRating || !serviceRating || !ambienceRating || !valueRating) {
        toast({
            title: "Incomplete Feedback",
            description: "Please provide a rating for all categories.",
            variant: "destructive"
        })
        return;
    }

    setIsSubmitting(true);
    
    const feedbackData = {
        orderId,
        ratings: {
            food: foodRating,
            service: serviceRating,
            ambience: ambienceRating,
            value: valueRating,
        },
        comments
    };

    console.log("Submitting feedback:", feedbackData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Feedback Submitted!',
      description: 'Thank you for helping us improve.',
    });
    
    setIsSubmitting(false);
    onFeedbackSubmitted();
  };

  const categories = [
    { title: 'Food Quality', rating: foodRating, setRating: setFoodRating },
    { title: 'Service', rating: serviceRating, setRating: setServiceRating },
    { title: 'Ambience', rating: ambienceRating, setRating: setAmbienceRating },
    { title: 'Value for Money', rating: valueRating, setRating: setValueRating },
  ];

  return (
    <div className="w-full animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
        <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-bold">Share Your Experience</CardTitle>
            <CardDescription>Your feedback helps us get better.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {categories.map((category, index) => (
                 <div
                    key={category.title}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-in fade-in-50 slide-in-from-bottom-3"
                    style={{animationDelay: `${index * 100}ms`}}
                >
                    <p className="font-medium text-base mb-2 sm:mb-0">{category.title}</p>
                    <StarRating rating={category.rating} setRating={category.setRating} />
                </div>
            ))}
          </div>
          
          <div className="space-y-2 animate-in fade-in-50 slide-in-from-bottom-3" style={{animationDelay: '400ms'}}>
            <label htmlFor="comments" className="font-medium">Additional Comments (Optional)</label>
            <Textarea
              id="comments"
              placeholder="Tell us more about your visit..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
                <>
                 <Send className="mr-2 h-5 w-5" /> Submit Feedback
                </>
            )}
          </Button>
        </form>
    </div>
  );
};
