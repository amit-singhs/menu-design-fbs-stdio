import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { statCards } from "@/app/dashboard/data";
import { cn } from "@/lib/utils";

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => (
        <Card key={card.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p
              className={cn(
                "text-xs text-muted-foreground",
                card.changeType === "increase"
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {card.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
