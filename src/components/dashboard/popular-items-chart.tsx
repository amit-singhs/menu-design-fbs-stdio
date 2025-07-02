"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { popularItemsData } from "@/app/dashboard/data";

const chartConfig = {
  sales: {
    label: "Sales",
  },
  ...popularItemsData.reduce((acc, item) => {
    acc[item.name] = { label: item.name };
    return acc;
  }, {}),
};

export function PopularItemsChart() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Popular Menu Items</CardTitle>
        <CardDescription>Top-selling items this month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={popularItemsData}
              dataKey="sales"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {popularItemsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing top 5 popular items
        </div>
      </CardFooter>
    </Card>
  );
}
