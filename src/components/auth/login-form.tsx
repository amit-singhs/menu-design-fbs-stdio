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
import { Loader2, UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/lib/api/auth-service';
import { setCookie, COOKIE_KEYS } from '@/lib/cookies';
import { useAuth } from '@/context/auth-context';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const loginMutation = useLogin();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      
      // Store JWT token in cookies
      setCookie(COOKIE_KEYS.AUTH_TOKEN, response.token);
      
      // Update auth context with token only
      login(response.token);
      
      toast({
        title: 'Login Successful!',
        description: 'Welcome back! Redirecting you to the dashboard.',
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An error occurred during login.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
            <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Welcome Back</h1>
            <p className="text-muted-foreground">
            Sign in to continue managing your restaurant.
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                  <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Button
                          type="button"
                          variant="link"
                          onClick={onForgotPassword}
                          className="ml-auto inline-block text-sm underline p-0 h-auto"
                      >
                          Forgot your password?
                      </Button>
                  </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </form>
      </Form>
    </>
  );
}
