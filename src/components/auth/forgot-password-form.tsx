'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Mail, UtensilsCrossed } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    console.log('Forgot Password Data:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Reset Link Sent',
      description: `If an account exists for ${data.email}, you will receive a password reset link shortly.`,
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };
  
  if (isSubmitted) {
      return (
          <div className="w-full max-w-md text-center">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
                <Mail className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold font-headline">Check Your Email</h1>
                <p className="text-muted-foreground mt-4">
                    We've sent a password reset link to the email address you provided. Please check your inbox and spam folders.
                </p>
            </div>
            <Button onClick={onBackToLogin} className="w-full">
                Back to Login
            </Button>
          </div>
      )
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
            <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Forgot Password?</h1>
            <p className="text-muted-foreground">
                No worries! Enter your email and we'll send you a reset link.
            </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@restaurant.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
           <Button type="button" variant="link" onClick={onBackToLogin} className="w-full">
            Back to Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
