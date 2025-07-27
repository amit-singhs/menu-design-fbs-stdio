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
} from "@/components/ui/chart";
import { popularItemsData } from "@/app/dashboard/data";
import { Pie, PieChart, Cell } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const chartConfig = {
  sales: {
    label: "Sales",
  },
  ...popularItemsData.reduce((acc, item) => {
    acc[item.name] = { label: item.name };
    return acc;
  }, {}),
};

export default function PopularItemsPage() {
    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                    Popular Items
                </h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Sales Distribution</CardTitle>
                        <CardDescription>By top selling items</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[350px]"
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
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Top Items List</CardTitle>
                        <CardDescription>A list of the most sold items.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead className="text-right">Number of Sales</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {popularItemsData.map((item) => (
                                <TableRow key={item.name}>
                                    <TableCell>
                                        <div className="font-medium">{item.name}</div>
                                    </TableCell>
                                    <TableCell className="text-right">{item.sales}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}