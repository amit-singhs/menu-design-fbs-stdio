'use client';

import { MenuForm } from "@/components/menu-form";
import { useRouter } from "next/navigation";

export default function AddMenuItemPage() {
    const router = useRouter();

    const handleMenuSaved = () => {
        // In a real app, you'd likely redirect to the menu list
        // and see a success toast.
        router.push('/dashboard/menu');
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8">
             <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                Add New Menu Item
                </h1>
            </div>
            {/* We can reuse the MenuForm here. We might want to adapt it later to handle a single item. */}
            <MenuForm onMenuSaved={handleMenuSaved} />
        </div>
    )
}