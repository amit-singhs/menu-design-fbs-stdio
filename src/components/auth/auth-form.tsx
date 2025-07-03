'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { UtensilsCrossed } from 'lucide-react';

export function AuthForm() {
  return (
    <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-primary rounded-full text-primary-foreground mb-4">
            <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Welcome Back</h1>
            <p className="text-muted-foreground">
            Sign in or create an account to manage your restaurant.
            </p>
        </div>
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-6">
                <LoginForm />
            </TabsContent>
            <TabsContent value="register" className="pt-6">
                <RegisterForm />
            </TabsContent>
        </Tabs>
    </div>
  );
}
