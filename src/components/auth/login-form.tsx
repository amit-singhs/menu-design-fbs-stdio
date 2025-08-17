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
import { extractRestaurantIdFromTokenString } from '@/lib/utils/jwt-utils';
import { graphqlClient } from '@/lib/graphql/client';

const loginFormSchema = z.object({
  user_name: z.string().min(1, 'Username is required.'),
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
      user_name: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      
      console.log('🔐 Login successful, JWT received');
      
      // Extract restaurantId from JWT token
      const restaurantId = extractRestaurantIdFromTokenString(response.token);
      
      console.log('🔍 Extracted restaurantId:', restaurantId);
      
      if (!restaurantId) {
        console.error('❌ No restaurantId found in JWT token');
        toast({
          title: 'Login Error',
          description: 'Invalid token received. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      // Trigger GraphQL query immediately
      console.log('🚀 Triggering GraphQL query with restaurantId:', restaurantId);
      
      try {
        const graphqlResponse = await graphqlClient.executeGetMenusWithItems(restaurantId);
        
        console.log('📊 GraphQL Query Result:', {
          hasData: !!graphqlResponse.data,
          hasError: !!graphqlResponse.error,
          menuCount: graphqlResponse.data?.menus?.length || 0,
          hasMenus: graphqlResponse.data?.menus && graphqlResponse.data.menus.length > 0,
          fullResponse: graphqlResponse,
          menus: graphqlResponse.data?.menus,
          isArray: Array.isArray(graphqlResponse.data?.menus),
        });
        
        // Store JWT token in cookies
        setCookie(COOKIE_KEYS.AUTH_TOKEN, response.token);
        
        // Update auth context with token
        login(response.token);
        
        // Determine redirect based on GraphQL response
        const menus = graphqlResponse.data?.menus;
        const hasMenus = menus && Array.isArray(menus) && menus.length > 0;
        
        // Test the logic with sample data
        console.log('🧪 Testing logic with sample data:');
        const testEmptyMenus = { data: { menus: [] } };
        const testWithMenus = { data: { menus: [{ name: "Test Menu" }] } };
        console.log('Empty menus test:', {
          hasMenus: testEmptyMenus.data?.menus && Array.isArray(testEmptyMenus.data.menus) && testEmptyMenus.data.menus.length > 0,
          menuCount: testEmptyMenus.data?.menus?.length || 0,
        });
        console.log('With menus test:', {
          hasMenus: testWithMenus.data?.menus && Array.isArray(testWithMenus.data.menus) && testWithMenus.data.menus.length > 0,
          menuCount: testWithMenus.data?.menus?.length || 0,
        });
        
        console.log('🔍 Redirect Logic Debug:', {
          hasMenus,
          menuCount: graphqlResponse.data?.menus?.length || 0,
          menus: graphqlResponse.data?.menus,
          dataExists: !!graphqlResponse.data,
          menusExists: !!graphqlResponse.data?.menus,
        });
        
        if (hasMenus) {
          console.log('🏪 User has menus, redirecting to dashboard');
          toast({
            title: 'Login Successful!',
            description: 'Welcome back! Redirecting you to the dashboard.',
          });
          router.push('/dashboard');
        } else {
          console.log('📝 User has no menus, redirecting to welcome page');
          toast({
            title: 'Login Successful!',
            description: 'Welcome! Let\'s create your first menu.',
          });
          router.push('/welcome');
        }
        
        // Fallback redirect in case the above doesn't work
        setTimeout(() => {
          if (hasMenus) {
            console.log('🔄 Fallback redirect to dashboard');
            router.push('/dashboard');
          } else {
            console.log('🔄 Fallback redirect to welcome');
            router.push('/welcome');
          }
        }, 1000);
        
        // Test router functionality
        console.log('🧪 Testing router functionality...');
        console.log('Router object:', router);
        console.log('Router.push method:', typeof router.push);
        
      } catch (graphqlError) {
        console.error('❌ GraphQL query failed:', graphqlError);
        
        // Store JWT token in cookies even if GraphQL fails
        setCookie(COOKIE_KEYS.AUTH_TOKEN, response.token);
        login(response.token);
        
        // On GraphQL error, redirect to welcome page
        toast({
          title: 'Login Successful!',
          description: 'Welcome! Let\'s create your first menu.',
        });
        router.push('/welcome');
      }
      
    } catch (error) {
      console.error('❌ Login failed:', error);
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
            name="user_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
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
