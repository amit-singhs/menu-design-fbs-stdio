'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export function AuthForm() {
  return (
    <div className="w-full max-w-md">
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
