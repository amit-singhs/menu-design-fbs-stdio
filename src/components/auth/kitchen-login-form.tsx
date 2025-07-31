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
import { Loader2, ChefHat } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const kitchenLoginFormSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

type KitchenLoginFormValues = z.infer<typeof kitchenLoginFormSchema>;

export function KitchenLoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<KitchenLoginFormValues>({
    resolver: zodResolver(kitchenLoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: KitchenLoginFormValues) => {
    setIsSubmitting(true);
    console.log('Kitchen Login Data:', data);
    
    // Simulate API call - for now, any credentials work.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Login Successful!',
      description: 'Redirecting to the kitchen display.',
    });
    
    router.push('/kitchen');

    // No need to set isSubmitting to false as we are redirecting.
  };

  return (
    <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary rounded-full text-primary-foreground">
                <ChefHat className="h-10 w-10" />
              </div>
            </div>
            <CardTitle className="font-headline text-3xl">Kitchen Staff Login</CardTitle>
            <CardDescription>Enter your credentials to access the order queue.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., kitchen_staff" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log In
                </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
