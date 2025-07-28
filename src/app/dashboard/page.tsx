import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileDown, PlusCircle } from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { PopularItemsChart } from "@/components/dashboard/popular-items-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button asChild className="w-full md:w-auto">
            <Link href="/dashboard/menu/edit">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Menu Item
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full md:w-auto">
             <Link href="/dashboard/qr-codes">
                <PlusCircle className="mr-2 h-4 w-4" /> Generate QR Code
            </Link>
          </Button>
          <Button variant="outline" className="w-full md:w-auto">
            <FileDown className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </div>
      </div>

      <StatsCards />
      
      <div className="grid gap-6 md:gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 h-full">
            <SalesChart />
        </div>
        <div className="lg:col-span-2 h-full">
            <PopularItemsChart />
        </div>
      </div>

      <RecentOrders />
    </div>
  );
}
