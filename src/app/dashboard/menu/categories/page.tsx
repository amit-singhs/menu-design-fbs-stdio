import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { menuItems } from "@/app/dashboard/data";

export default function CategoriesPage() {
    const categories = [...new Set(menuItems.map(item => item.category))];

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                    Menu Categories
                </h1>
                <Button className="w-full md:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Existing Categories</CardTitle>
                    <CardDescription>Manage the categories for your menu items.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories.map(category => (
                            <div key={category} className="p-4 border rounded-lg text-center font-medium bg-muted/50">
                                {category}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}