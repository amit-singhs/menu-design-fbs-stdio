'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';
import { ForgotPasswordForm } from './forgot-password-form';

export function AuthForm() {
  const [view, setView] = useState<'login' | 'register' | 'forgot-password'>('login');

  if (view === 'forgot-password') {
    return <ForgotPasswordForm onBackToLogin={() => setView('login')} />;
  }

  return (
    <div className="w-full max-w-md">
      <Tabs
        defaultValue="login"
        className="w-full"
        value={view}
        onValueChange={(value) => setView(value as 'login' | 'register')}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="pt-6">
          <LoginForm onForgotPassword={() => setView('forgot-password')} />
        </TabsContent>
        <TabsContent value="register" className="pt-6">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
