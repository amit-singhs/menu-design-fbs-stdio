import type { LucideIcon } from "lucide-react";
import {
  Home,
  ShoppingCart,
  BookOpen,
  LineChart,
  Settings,
  Star,
  QrCode,
  MessageSquare,
} from "lucide-react";

// Types
export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  children?: NavItem[];
};

export type StatCard = {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: LucideIcon;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  date: string;
};

export type SalesData = {
  date: string;
  sales: number;
};

export type PopularItem = {
  name: string;
  sales: number;
  fill: string;
};

// Data
export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    children: [
      { title: "Current Orders", href: "/dashboard/orders/current", icon: ShoppingCart },
      { title: "Order History", href: "/dashboard/orders/history", icon: ShoppingCart },
    ],
  },
  {
    title: "Menu Management",
    href: "/dashboard/menu",
    icon: BookOpen,
    children: [
        { title: "Add Item", href: "/dashboard/menu/add", icon: BookOpen },
        { title: "View/Edit Items", href: "/dashboard/menu/edit", icon: BookOpen },
        { title: "Categories", href: "/dashboard/menu/categories", icon: BookOpen },
    ],
  },
  {
    title: "Sales Overview",
    href: "/dashboard/sales",
    icon: LineChart,
  },
  {
    title: "Popular Items",
    href: "/dashboard/popular",
    icon: Star,
  },
  {
    title: "View Existing QR Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
  },
  {
    title: "Customer Feedback",
    href: "/dashboard/feedback",
    icon: MessageSquare,
    children: [
        { title: "View Reviews", href: "/dashboard/feedback/view", icon: MessageSquare },
        { title: "Respond to Reviews", href: "/dashboard/feedback/respond", icon: MessageSquare },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    children: [
        { title: "Restaurant Profile", href: "/dashboard/settings/profile", icon: Settings },
        { title: "Notifications", href: "/dashboard/settings/notifications", icon: Settings },
    ]
  },
];

export const statCards: StatCard[] = [
  {
    title: "Total Revenue Today",
    value: "$4,290.50",
    change: "+20.1% from yesterday",
    changeType: "increase",
    icon: LineChart,
  },
  {
    title: "Total Orders Today",
    value: "152",
    change: "+12.5% from yesterday",
    changeType: "increase",
    icon: ShoppingCart,
  },
  {
    title: "Current Active Orders",
    value: "12",
    change: "-2 from last hour",
    changeType: "decrease",
    icon: ShoppingCart,
  },
  {
    title: "Average Order Value",
    value: "$28.23",
    change: "+5.2% from yesterday",
    changeType: "increase",
    icon: LineChart,
  },
];

export const recentOrders: Order[] = [
    { id: "ORD001", customer: "Liam Johnson", email: "liam@example.com", amount: 250.00, status: "Completed", date: "2023-06-23" },
    { id: "ORD002", customer: "Olivia Smith", email: "olivia@example.com", amount: 150.00, status: "Processing", date: "2023-06-24" },
    { id: "ORD003", customer: "Noah Williams", email: "noah@example.com", amount: 350.00, status: "Completed", date: "2023-06-25" },
    { id: "ORD004", customer: "Emma Brown", email: "emma@example.com", amount: 450.00, status: "Pending", date: "2023-06-26" },
    { id: "ORD005", customer: "James Jones", email: "james@example.com", amount: 550.00, status: "Completed", date: "2023-06-27" },
];

export const salesData: SalesData[] = [
    { date: "Mon", sales: 4000 },
    { date: "Tue", sales: 3000 },
    { date: "Wed", sales: 2000 },
    { date: "Thu", sales: 2780 },
    { date: "Fri", sales: 1890 },
    { date: "Sat", sales: 2390 },
    { date: "Sun", sales: 3490 },
];

export const popularItemsData: PopularItem[] = [
    { name: "Margherita Pizza", sales: 120, fill: "hsl(var(--chart-1))" },
    { name: "Cheeseburger", sales: 98, fill: "hsl(var(--chart-2))" },
    { name: "Spaghetti Carbonara", sales: 75, fill: "hsl(var(--chart-3))" },
    { name: "Caesar Salad", sales: 60, fill: "hsl(var(--chart-4))" },
    { name: "Garlic Bread", sales: 45, fill: "hsl(var(--chart-5))" },
];
