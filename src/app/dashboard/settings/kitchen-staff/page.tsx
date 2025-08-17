'use client';

import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load the kitchen staff management component
const KitchenStaffManagement = lazy(() => 
  import('@/components/dashboard/kitchen-staff-management').then(module => ({
    default: module.KitchenStaffManagement
  }))
);

export default function KitchenStaffPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading Kitchen Staff Management...</span>
            </div>
        }>
            <KitchenStaffManagement />
        </Suspense>
    );
}
