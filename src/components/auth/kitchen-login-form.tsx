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
import { useStaffLogin } from '@/lib/api/auth-service';
import { setCookie, COOKIE_KEYS } from '@/lib/cookies';

const kitchenLoginFormSchema = z.object({
  user_name: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

type KitchenLoginFormValues = z.infer<typeof kitchenLoginFormSchema>;

export function KitchenLoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const staffLoginMutation = useStaffLogin();

  const form = useForm<KitchenLoginFormValues>({
    resolver: zodResolver(kitchenLoginFormSchema),
    defaultValues: {
      user_name: '',
      password: '',
    },
  });

  const onSubmit = async (data: KitchenLoginFormValues) => {
    try {
      const response = await staffLoginMutation.mutateAsync({
        user_name: data.user_name,
        password: data.password,
        role: 'kitchen_staff'
      });

      // Store staff JWT token in cookies (separate from admin token)
      setCookie(COOKIE_KEYS.STAFF_AUTH_TOKEN, response.token);
      
      console.log('🔐 Staff login successful, JWT received');
      
      toast({
        title: 'Login Successful!',
        description: 'Redirecting to the kitchen display.',
      });
      
      // Redirect to kitchen page
      router.push('/kitchen');
      
    } catch (error) {
      console.error('❌ Staff login failed:', error);
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
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
                    name="user_name"
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
                <Button type="submit" className="w-full h-12 text-base" disabled={staffLoginMutation.isPending}>
                    {staffLoginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log In
                </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
