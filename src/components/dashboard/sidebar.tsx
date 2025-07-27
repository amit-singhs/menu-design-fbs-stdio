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
  SidebarTrigger,
  useSidebar,
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
import React, { useState, useEffect } from "react";

const SidebarNavItem = ({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();
  const isChildActive = item.children?.some(
    (child) => pathname === child.href
  );

  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (state === "collapsed") {
      setIsOpen(false);
    }
  }, [state]);

  useEffect(() => {
    setIsOpen(isChildActive);
  }, [isChildActive]);

  if (item.children) {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={(openState) => {
          if (state === "collapsed") {
            setOpen(true);
            setIsOpen(true);
          } else {
            setIsOpen(openState);
          }
        }}
      >
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
        <CollapsibleContent className="pl-6 group-data-[collapsible=icon]:hidden">
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
      <SidebarMenuButton
        variant="ghost"
        isActive={pathname === item.href}
        onClick={() => {
          if (state === "collapsed") {
            setOpen(true);
          }
        }}
      >
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
      <SidebarHeader className="hidden md:flex flex-row justify-between items-center">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <ChefHat className="w-6 h-6 transition-all" />
          <span className="font-semibold font-headline text-lg transition-all">
            Bella Vista
          </span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
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
