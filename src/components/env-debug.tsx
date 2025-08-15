/**
 * Environment Debug Component
 * Temporary component to debug environment variables and GraphQL client
 */

'use client';

import { useEffect, useState } from 'react';
import { validateGraphQLAuthentication } from '@/lib/utils/jwt-utils';

export function EnvDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      hasGraphQLEndpoint: !!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT,
      hasGraphQLApiKey: !!process.env.NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY,
      graphQLEndpoint: process.env.NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT,
      isAuthenticated: validateGraphQLAuthentication(),
      isBrowser: typeof window !== 'undefined' && typeof document !== 'undefined',
    };
    
    console.log('🔧 Environment Debug Info:', info);
    setDebugInfo(info);
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-yellow-50">
      <h2 className="text-lg font-semibold mb-4">Environment Debug</h2>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Has GraphQL Endpoint:</strong> {debugInfo.hasGraphQLEndpoint ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>Has GraphQL API Key:</strong> {debugInfo.hasGraphQLApiKey ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>GraphQL Endpoint:</strong> {debugInfo.graphQLEndpoint || 'Not set'}
        </div>
        
        <div>
          <strong>Is Authenticated:</strong> {debugInfo.isAuthenticated ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>Is Browser:</strong> {debugInfo.isBrowser ? '✅ Yes' : '❌ No'}
        </div>
      </div>
      
      {!debugInfo.hasGraphQLEndpoint && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
          <strong>⚠️ Missing Environment Variables:</strong>
          <br />
          Please set NEXT_PUBLIC_MENU_MANAGEMENT_GRAPHQL_ENDPOINT and NEXT_PUBLIC_MENU_MANAGEMENT_API_KEY in your .env.local file
        </div>
      )}
    </div>
  );
} 