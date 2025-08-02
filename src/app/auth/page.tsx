'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { RouteGuard } from '@/components/auth/route-guard';
import Image from 'next/image';


export default function AuthenticationPage() {
  return (
    <RouteGuard requireAuth={false}>
      <div className="w-full h-screen overflow-hidden lg:grid lg:grid-cols-2">
        <div className="hidden bg-primary/10 lg:block relative">
          <Image
            src="/assets/shayna-douglas-H8qwryGP_h0-unsplash.jpg"
            alt="A vibrant dish from a restaurant menu"
            width="1200"
            height="1800"
            data-ai-hint="vibrant dish"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-end p-10 text-background">
            <h1 className="font-headline text-5xl font-bold">MenuStart</h1>
            <p className="text-xl mt-2 max-w-md">The simplest way to bring your restaurant's menu online.</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 sm:p-12 h-full overflow-y-auto">
          <AuthForm />
        </div>
      </div>
    </RouteGuard>
  );
}
