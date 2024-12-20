import { Home, BarChart2, DollarSign, Settings, CreditCard, Receipt } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BarChart2, label: "P-insights", href: "/insights" },
  { icon: DollarSign, label: "Loan Management System", href: "/loans" },
  { icon: CreditCard, label: "Credit Scoring Engine", href: "/credit" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: Receipt, label: "Billing", href: "/billing" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="p-4">
            <h1 className="text-2xl font-bold text-teal-500">Pesabu</h1>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <a href={item.href} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}