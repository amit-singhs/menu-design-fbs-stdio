'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { OrderProvider } from '@/context/order-context';
import { AuthProvider } from '@/context/auth-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 