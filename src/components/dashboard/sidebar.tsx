"use client";

import { ChefHat } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { navItems } from "@/app/dashboard/data";
import type { NavItem } from "@/app/dashboard/data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarNavItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  if (item.children) {
    const isChildActive = item.children.some(
      (child) => pathname === child.href
    );

    return (
      <Collapsible defaultOpen={isChildActive}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            variant="ghost"
            className="w-full justify-start"
            isActive={isChildActive}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6">
          <SidebarMenu>
            {item.children.map((child) => (
              <SidebarMenuItem key={child.href}>
                <Link href={child.href}>
                  <SidebarMenuButton
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    isActive={pathname === child.href}
                  >
                    {child.title}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link href={item.href}>
      <SidebarMenuButton variant="ghost" isActive={isActive}>
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </Link>
  );
};

export function DashboardSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="group-data-[variant=sidebar]:border-r"
    >
      <SidebarHeader className="hidden md:flex justify-start items-center gap-2">
        <ChefHat className="w-6 h-6 transition-all group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8" />
        <span className="font-semibold font-headline text-lg transition-all group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:-translate-x-4">
          Bella Vista
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarNavItem item={item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Placeholder for footer content */}
      </SidebarFooter>
    </Sidebar>
  );
}
