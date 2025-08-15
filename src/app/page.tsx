'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { EnvDebug } from '@/components/env-debug';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Loading state - only consider auth loading
  const isLoading = authLoading;

  // Check if we're on the client side
  useEffect(() => {
    console.log('🔄 Setting isClient to true');
    setIsClient(true);
  }, []);

  // Log authentication state changes
  useEffect(() => {
    if (isClient) {
      console.log('🔐 Authentication State Changed:', {
        isAuthenticated,
        authLoading,
      });
    }
  }, [isClient, isAuthenticated, authLoading]);

  useEffect(() => {
    console.log('🔄 Home Page Routing Logic:', {
      isClient,
      authLoading,
      isAuthenticated,
    });

    // Only run routing logic on the client side
    if (!isClient) {
      console.log('⏳ Waiting for client-side rendering...');
      return;
    }

    if (!authLoading) {
      if (isAuthenticated) {
        console.log('✅ User is authenticated, redirecting to dashboard');
        // User is authenticated, redirect to dashboard (menu check already done in login)
        router.push('/dashboard');
      } else {
        console.log('❌ User is not authenticated, redirecting to auth page');
        // User is not authenticated, redirect to auth page
        router.push('/auth');
      }
    } else {
      console.log('⏳ Still checking authentication...');
    }
  }, [isAuthenticated, authLoading, router, isClient]);

  // Note: Menu checking is now handled in the login form
  // This page only handles basic authentication routing

  // Show loading state while checking authentication and menu availability
  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {!isClient ? 'Loading...' : authLoading ? 'Checking authentication...' : 'Redirecting...'}
          </p>
          {/* Temporary debug component */}
          <div className="mt-8">
            <EnvDebug />
            <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>isClient: {isClient.toString()}</p>
              <p>authLoading: {authLoading.toString()}</p>
              <p>isAuthenticated: {isAuthenticated.toString()}</p>
              <p>GraphQL Endpoint: {process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT ? '✅ Set' : '❌ Not set'}</p>
              <p>GraphQL API Key: {process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY ? '✅ Set' : '❌ Not set'}</p>
              <button 
                onClick={() => {
                  console.log('🔍 Checking JWT token...');
                  const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('auth_token='))
                    ?.split('=')[1];
                  console.log('JWT Token:', token ? token.substring(0, 20) + '...' : 'Not found');
                  if (token) {
                    try {
                      const payload = JSON.parse(atob(token.split('.')[1]));
                      console.log('JWT Payload:', payload);
                    } catch (error) {
                      console.error('Error decoding JWT:', error);
                    }
                  }
                }}
                className="mt-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
              >
                Check JWT Token
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This will be shown briefly while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
        {/* Temporary debug component */}
        <div className="mt-8">
          <EnvDebug />
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>isClient: {isClient.toString()}</p>
            <p>authLoading: {authLoading.toString()}</p>
            <p>isAuthenticated: {isAuthenticated.toString()}</p>
            <p>GraphQL Endpoint: {process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT ? '✅ Set' : '❌ Not set'}</p>
            <p>GraphQL API Key: {process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY ? '✅ Set' : '❌ Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
