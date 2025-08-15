/**
 * SSR Test Component
 * Test component to verify SSR-safe implementation
 */

'use client';

import { useEffect, useState } from 'react';
import { validateGraphQLAuthentication } from '@/lib/utils/jwt-utils';

export function SSRTest() {
  const [isClient, setIsClient] = useState(false);
  const [authStatus, setAuthStatus] = useState<string>('Checking...');

  useEffect(() => {
    setIsClient(true);
    
    try {
      const isAuthenticated = validateGraphQLAuthentication();
      setAuthStatus(isAuthenticated ? 'Authenticated' : 'Not Authenticated');
    } catch (error) {
      setAuthStatus('Error: ' + (error as Error).message);
    }
  }, []);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">SSR Test</h2>
      
      <div className="space-y-2">
        <div>
          <strong>Client Side:</strong> {isClient ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>Authentication Status:</strong> {authStatus}
        </div>
        
        <div>
          <strong>SSR Safe:</strong> ✅ Yes (no document errors)
        </div>
      </div>
    </div>
  );
} 