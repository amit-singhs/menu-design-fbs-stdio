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
  Package,
  History,
  PlusCircle,
  List,
  LayoutGrid,
  User,
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
  type: "Dine-In" | "Takeout" | "Delivery";
  items: number;
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

export type MenuItem = {
    id: string;
    name: string;
    price: number;
    category: string;
    availability: "Available" | "Unavailable";
    stock: number;
};

export type Feedback = {
    id: string;
    customer: string;
    date: string;
    rating: number;
    comment: string;
};

// Data
export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  {
    title: "Orders",
    href: "#",
    icon: ShoppingCart,
    children: [
      { title: "Current Orders", href: "/dashboard/orders/current", icon: Package },
      { title: "Order History", href: "/dashboard/orders/history", icon: History },
    ],
  },
  {
    title: "Menu Management",
    href: "#",
    icon: BookOpen,
    children: [
        { title: "View/Edit Items", href: "/dashboard/menu", icon: List },
        { title: "Add Item", href: "/dashboard/menu/add", icon: PlusCircle },
        { title: "Categories", href: "/dashboard/menu/categories", icon: LayoutGrid },
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
    ],
  },
  {
    title: "Settings",
    href: "#",
    icon: Settings,
    children: [
        { title: "Restaurant Profile", href: "/dashboard/settings/profile", icon: User },
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
    { id: "ORD001", customer: "Liam Johnson", email: "liam@example.com", amount: 250.00, status: "Completed", date: "2023-06-23", type: "Dine-In", items: 3 },
    { id: "ORD002", customer: "Olivia Smith", email: "olivia@example.com", amount: 150.00, status: "Processing", date: "2023-06-24", type: "Takeout", items: 2 },
    { id: "ORD003", customer: "Noah Williams", email: "noah@example.com", amount: 350.00, status: "Completed", date: "2023-06-25", type: "Delivery", items: 5 },
    { id: "ORD004", customer: "Emma Brown", email: "emma@example.com", amount: 450.00, status: "Pending", date: "2023-06-26", type: "Dine-In", items: 4 },
    { id: "ORD005", customer: "James Jones", email: "james@example.com", amount: 550.00, status: "Completed", date: "2023-06-27", type: "Takeout", items: 1 },
];

export const allOrders: Order[] = [
  ...recentOrders,
  { id: "ORD006", customer: "Sophia Davis", email: "sophia@example.com", amount: 120.00, status: "Completed", date: "2023-06-22", type: "Delivery", items: 2 },
  { id: "ORD007", customer: "William Garcia", email: "william@example.com", amount: 80.00, status: "Cancelled", date: "2023-06-21", type: "Dine-In", items: 1 },
  { id: "ORD008", customer: "Isabella Rodriguez", email: "isabella@example.com", amount: 200.00, status: "Completed", date: "2023-06-20", type: "Takeout", items: 3 },
  { id: "ORD009", customer: "Michael Miller", email: "michael@example.com", amount: 175.00, status: "Processing", date: "2023-06-26", type: "Dine-In", items: 2 },
  { id: "ORD010", customer: "Ava Martinez", email: "ava@example.com", amount: 300.00, status: "Completed", date: "2023-06-25", type: "Delivery", items: 4 },
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

export const menuItems: MenuItem[] = [
    { id: "ITEM001", name: "Margherita Pizza", price: 12.99, category: "Pizza", availability: "Available", stock: 50 },
    { id: "ITEM002", name: "Cheeseburger", price: 9.99, category: "Burgers", availability: "Available", stock: 100 },
    { id: "ITEM003", name: "Spaghetti Carbonara", price: 15.50, category: "Pasta", availability: "Available", stock: 30 },
    { id: "ITEM004", name: "Caesar Salad", price: 8.75, category: "Salads", availability: "Unavailable", stock: 0 },
    { id: "ITEM005", name: "Garlic Bread", price: 5.00, category: "Appetizers", availability: "Available", stock: 200 },
    { id: "ITEM006", name: "Tiramisu", price: 7.25, category: "Desserts", availability: "Available", stock: 40 },
];

export const customerFeedback: Feedback[] = [
    { id: "FB001", customer: "Liam Johnson", date: "2023-06-23", rating: 5, comment: "Amazing food and great service!" },
    { id: "FB002", customer: "Olivia Smith", date: "2023-06-24", rating: 4, comment: "The pasta was a bit cold, but everything else was good." },
    { id: "FB003", customer: "Noah Williams", date: "2023-06-25", rating: 5, comment: "Best pizza in town! Will be back for sure." },
    { id: "FB004", customer: "Emma Brown", date: "2023-06-26", rating: 3, comment: "Service was slow and the restaurant was too noisy." },
    { id: "FB005", customer: "James Jones", date: "2023-06-27", rating: 4, comment: "The burger was delicious, but the fries were a bit soggy." },
];
