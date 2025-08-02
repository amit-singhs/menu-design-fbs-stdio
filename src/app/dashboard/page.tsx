'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RouteGuard } from '@/components/auth/route-guard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileDown, View } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { PopularItemsChart } from '@/components/dashboard/popular-items-chart';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

type VisibleComponents = {
  stats: boolean;
  sales: boolean;
  popular: boolean;
};

export default function DashboardPage() {
  const [visibleComponents, setVisibleComponents] = useState<VisibleComponents>({
    stats: true,
    sales: true,
    popular: true,
  });

  const handleVisibilityChange = (component: keyof VisibleComponents, checked: boolean) => {
    setVisibleComponents((prev) => ({ ...prev, [component]: checked }));
  };

  const visibleCount = Object.values(visibleComponents).filter(Boolean).length;

  return (
    <RouteGuard>
      <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <View className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Toggle Components</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleComponents.stats}
                onCheckedChange={(checked) => handleVisibilityChange('stats', checked)}
              >
                Stat Cards
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleComponents.sales}
                onCheckedChange={(checked) => handleVisibilityChange('sales', checked)}
              >
                Sales Chart
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={visibleComponents.popular}
                onCheckedChange={(checked) => handleVisibilityChange('popular', checked)}
              >
                Popular Items
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="w-full md:w-auto">
            <FileDown className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </div>
      </div>

      <Collapsible open={visibleComponents.stats} className="w-full">
        <CollapsibleContent>
            <div className="pb-6 md:pb-8">
                <StatsCards />
            </div>
        </CollapsibleContent>
      </Collapsible>

      <div
        className={cn(
          'grid gap-6 md:gap-8',
          visibleCount > 1 && 'lg:grid-cols-5'
        )}
      >
        <Collapsible open={visibleComponents.sales} className={cn(
              'h-full w-full',
              visibleCount > 1 && visibleComponents.popular ? 'lg:col-span-3' : 'lg:col-span-5'
            )}>
            <CollapsibleContent>
                <SalesChart />
            </CollapsibleContent>
        </Collapsible>
        
        <Collapsible open={visibleComponents.popular} className={cn(
              'h-full w-full',
              visibleCount > 1 && visibleComponents.sales ? 'lg:col-span-2' : 'lg:col-span-5'
            )}>
             <CollapsibleContent>
                <PopularItemsChart />
            </CollapsibleContent>
        </Collapsible>
      </div>
      
       <div className="grid gap-6 md:gap-8">
         <RecentOrders />
       </div>
      </div>
    </RouteGuard>
  );
}
