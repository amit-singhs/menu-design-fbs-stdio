'use client';

import { MenuForm } from '@/components/menu-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateMenuPage() {
  const router = useRouter();

  const handleMenuSaved = () => {
    // Redirect back to the menu list after successful creation
    router.push('/dashboard/menu');
  };

  return (
    <MenuForm onMenuSaved={handleMenuSaved} />
  );
} 