import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { salesData } from "@/app/dashboard/data";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const monthlySalesData = [
  { month: "Jan", sales: 2400 },
  { month: "Feb", sales: 1398 },
  { month: "Mar", sales: 9800 },
  { month: "Apr", sales: 3908 },
  { month: "May", sales: 4800 },
  { month: "Jun", sales: 3800 },
  { month: "Jul", sales: 4300 },
];


export default function SalesOverviewPage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                    Sales Overview
                </h1>
            </div>
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Daily Sales</CardTitle>
                        <CardDescription>Last 7 Days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart accessibilityLayer data={salesData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tickFormatter={(value) => `$${value / 1000}K`}
                            />
                            <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
                        </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Monthly Sales Trend</CardTitle>
                        <CardDescription>Last 7 Months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <LineChart
                                accessibilityLayer
                                data={monthlySalesData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                                >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `$${value / 1000}K`}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line
                                    dataKey="sales"
                                    type="monotone"
                                    stroke="var(--color-sales)"
                                    strokeWidth={2}
                                    dot={true}
                                />
                                </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}