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
  List,
  LayoutGrid,
  User,
  ToggleLeft,
  Users,
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
  id: string;
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
  items: CartItem[];
  tableNumber: string;
  specialInstructions?: string;
};

export type CartItem = {
  dishName: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export type SalesData = {
  date: string;
  sales: number;
};

export type MonthlySalesData = {
    month: string;
    sales: number;
}

export type PopularItem = {
  name: string;
  sales: number;
  fill: string;
};

export type MenuItem = {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    subcategory?: string;
    availability: "Available" | "Unavailable";
    stock: number;
};

export type Feedback = {
    id: string;
    customer: string;
    date: string;
    ratings: {
        food: number;
        service: number;
        ambience: number;
        value: number;
    };
    comment: string;
    orderId: string;
};

export type QrCodeType = {
    id: string;
    name: string;
    date: string;
}

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
        { title: "Item Availability", href: "/dashboard/menu", icon: ToggleLeft },
        { title: "Edit Menu", href: "/dashboard/menu/edit", icon: LayoutGrid },
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
    href: "#",
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
        { title: "Kitchen Staff", href: "/dashboard/settings/kitchen-staff", icon: Users },
    ]
  },
];

export const statCards: StatCard[] = [
  {
    id: 'revenue',
    title: "Total Revenue Today",
    value: "$4,290.50",
    change: "+20.1% from yesterday",
    changeType: "increase",
    icon: LineChart,
  },
  {
    id: 'orders',
    title: "Total Orders Today",
    value: "152",
    change: "+12.5% from yesterday",
    changeType: "increase",
    icon: ShoppingCart,
  },
  {
    id: 'active',
    title: "Current Active Orders",
    value: "12",
    change: "-2 from last hour",
    changeType: "decrease",
    icon: ShoppingCart,
  },
  {
    id: 'avg-order',
    title: "Average Order Value",
    value: "$28.23",
    change: "+5.2% from yesterday",
    changeType: "increase",
    icon: LineChart,
  },
];

export const recentOrders: Order[] = [
    { id: "ORD001", customer: "Liam Johnson", email: "liam@example.com", amount: 38.50, status: "Completed", date: "2023-06-23", type: "Dine-In", tableNumber: '5', specialInstructions: "Please ensure the steak is medium-rare.", items: [{dishName: 'T-Bone Steak', price: 25.50, quantity: 1, specialInstructions: 'Extra garlic butter on the side'}, {dishName: 'Coke', price: 3.00, quantity: 1}]},
    { id: "ORD002", customer: "Olivia Smith", email: "olivia@example.com", amount: 25.00, status: "Processing", date: "2023-06-24", type: "Takeout", tableNumber: 'N/A', items: [{dishName: 'Cheeseburger', price: 15.00, quantity: 1, specialInstructions: "No pickles"}, {dishName: 'Fries', price: 5.00, quantity: 1}]},
    { id: "ORD003", customer: "Noah Williams", email: "noah@example.com", amount: 45.00, status: "Completed", date: "2023-06-25", type: "Delivery", tableNumber: 'N/A', specialInstructions: "Leave at the front door.", items: [{dishName: 'Pepperoni Pizza', price: 20.00, quantity: 1}, {dishName: 'Wings', price: 15.00, quantity: 1}]},
    { id: "ORD004", customer: "Emma Brown", email: "emma@example.com", amount: 15.00, status: "Pending", date: "2023-06-26", type: "Dine-In", tableNumber: '12', items: [{dishName: 'Caesar Salad', price: 15.00, quantity: 1}]},
    { id: "ORD005", customer: "James Jones", email: "james@example.com", amount: 50.00, status: "Completed", date: "2023-06-27", type: "Takeout", tableNumber: 'N/A', items: [{dishName: 'Spaghetti Carbonara', price: 18.00, quantity: 2, specialInstructions: 'Gluten-free pasta'}]},
];

export const allOrders: Order[] = [
  ...recentOrders,
  { id: "ORD006", customer: "Sophia Davis", email: "sophia@example.com", amount: 22.00, status: "Completed", date: "2023-06-22", type: "Delivery", tableNumber: 'N/A', items: [{dishName: 'Veggie Wrap', price: 12.00, quantity: 1}]},
  { id: "ORD007", customer: "William Garcia", email: "william@example.com", amount: 18.00, status: "Cancelled", date: "2023-06-21", type: "Dine-In", tableNumber: '2', items: [{dishName: 'Chicken Soup', price: 18.00, quantity: 1}]},
  { id: "ORD008", customer: "Isabella Rodriguez", email: "isabella@example.com", amount: 33.00, status: "Completed", date: "2023-06-20", type: "Takeout", tableNumber: 'N/A', specialInstructions: "Extra napkins please.", items: [{dishName: 'Fish and Chips', price: 22.00, quantity: 1, specialInstructions: 'Extra tartar sauce'}]},
  { id: "ORD009", customer: "Michael Miller", email: "michael@example.com", amount: 40.00, status: "Processing", date: "2023-06-26", type: "Dine-In", tableNumber: '9', items: [{dishName: 'Penne alla Vodka', price: 20.00, quantity: 2}]},
  { id: "ORD010", customer: "Ava Martinez", email: "ava@example.com", amount: 30.00, status: "Completed", date: "2023-06-25", type: "Delivery", tableNumber: 'N/A', items: [{dishName: 'Tacos', price: 15.00, quantity: 2, specialInstructions: "No onions"}]},
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

export const monthlySalesData: MonthlySalesData[] = [
    { month: "Jan", sales: 2400 },
    { month: "Feb", sales: 1398 },
    { month: "Mar", sales: 9800 },
    { month: "Apr", sales: 3908 },
    { month: "May", sales: 4800 },
    { month: "Jun", sales: 3800 },
    { month: "Jul", sales: 4300 },
];

export const popularItemsData: PopularItem[] = [
    { name: "Margherita Pizza", sales: 120, fill: "hsl(var(--chart-1))" },
    { name: "Cheeseburger", sales: 98, fill: "hsl(var(--chart-2))" },
    { name: "Spaghetti Carbonara", sales: 75, fill: "hsl(var(--chart-3))" },
    { name: "Caesar Salad", sales: 60, fill: "hsl(var(--chart-4))" },
    { name: "Garlic Bread", sales: 45, fill: "hsl(var(--chart-5))" },
];

export const menuItems: MenuItem[] = [
    { id: "ITEM001", name: "Margherita Pizza", description: "Classic pizza with fresh mozzarella, tomatoes, and basil.", price: 12.99, category: "Pizza", availability: "Available", stock: 50 },
    { id: "ITEM002", name: "Cheeseburger", description: "Juicy beef patty with cheddar cheese, lettuce, tomato, and onion.", price: 9.99, category: "Burgers", availability: "Available", stock: 100 },
    { id: "ITEM003", name: "Spaghetti Carbonara", description: "Pasta with creamy egg sauce, pancetta, and pecorino cheese.", price: 15.50, category: "Pasta", availability: "Available", stock: 30 },
    { id: "ITEM004", name: "Caesar Salad", description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan.", price: 8.75, category: "Unavailable", stock: 0 },
    { id: "ITEM005", name: "Garlic Bread", description: "Toasted bread with garlic, butter, and herbs.", price: 5.00, category: "Appetizers", availability: "Available", stock: 200 },
    { id: "ITEM006", name: "Tiramisu", description: "Coffee-flavored Italian dessert.", price: 7.25, category: "Desserts", availability: "Available", stock: 40 },
    { id: "ITEM007", name: "Hawaiian Pizza", description: "Pizza with ham and pineapple.", price: 13.99, category: "Pizza", availability: "Available", stock: 40 },
    { id: "ITEM008", name: "Veggie Burger", description: "Plant-based patty with all the fixings.", price: 10.99, category: "Burgers", availability: "Available", stock: 50 },
];

export const customerFeedback: Feedback[] = [
    { id: "FB001", customer: "Liam Johnson", date: "2023-06-23", orderId: "ORD001", ratings: { food: 5, service: 5, ambience: 4, value: 5 }, comment: "Amazing food and great service!" },
    { id: "FB002", customer: "Olivia Smith", date: "2023-06-24", orderId: "ORD002", ratings: { food: 3, service: 4, ambience: 3, value: 4 }, comment: "The pasta was a bit cold, but everything else was good." },
    { id: "FB003", customer: "Noah Williams", date: "2023-06-25", orderId: "ORD003", ratings: { food: 5, service: 5, ambience: 5, value: 5 }, comment: "Best pizza in town! Will be back for sure." },
    { id: "FB004", customer: "Emma Brown", date: "2023-06-26", orderId: "ORD004", ratings: { food: 4, service: 2, ambience: 2, value: 3 }, comment: "Service was slow and the restaurant was too noisy." },
    { id: "FB005", customer: "James Jones", date: "2023-06-27", orderId: "ORD005", ratings: { food: 5, service: 4, ambience: 4, value: 4 }, comment: "The burger was delicious, but the fries were a bit soggy." },
];

export const qrCodes: QrCodeType[] = [
    { id: 'qr1', name: 'Main Dining Area - Table Menu', date: '2023-06-01' },
    { id: 'qr2', name: 'Patio Menu - Summer Special', date: '2023-05-15' },
    { id: 'qr3', name: 'Bar Menu - Happy Hour', date: '2023-06-10' },
];
