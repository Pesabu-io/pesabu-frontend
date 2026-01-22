"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarSkeleton from "./SidebarSkeleton";
import { 
  Home, 
  PieChart, 
  Coins, 
  Brain, 
  Settings, 
  Receipt, 
  ChevronRight, 
  LogOut,
  Sparkles,
  Crown,
  Mail
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onOpenChange }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarLinks = useMemo(() => [
    { icon: Home, text: "Home", href: "/", badge: null },
    { icon: PieChart, text: "P-insights", href: "/pinsights", badge: null },
    { icon: Coins, text: "Loans", href: "/loans", badge: null },
    { icon: Brain, text: "Credit Score", href: "/credit-score", badge: "Pro" },
  ], []);

  const footerLinks = useMemo(() => [
    { icon: Settings, text: "Settings", href: "/settings" },
    { icon: Receipt, text: "Billing", href: "/billing" },
  ], []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const currentIndex = sidebarLinks.findIndex(
      (link) => pathname === link.href || pathname?.startsWith(link.href + "/")
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, sidebarLinks]);

  // Sync with external open state
  useEffect(() => {
    if (open !== undefined) {
      setMobileOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setMobileOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  // Close sidebar on mobile when link is clicked
  const handleLinkClick = () => {
    if (isMobile) {
      handleOpenChange(false);
    }
  };

  if (!isMounted) {
    return <SidebarSkeleton />;
  }

  const getUserInitials = () => {
    if (user?.username) {
      const names = user.username.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.username.substring(0, 2).toUpperCase();
    }
    const clientName =
      typeof window !== "undefined"
        ? localStorage.getItem("statementClientName") || "User"
        : "User";
    const names = clientName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return clientName.substring(0, 2).toUpperCase();
  };

  const sidebarContent = (
    <div className="relative w-full h-full bg-gradient-to-b from-white via-gray-50/30 to-white flex flex-col backdrop-blur-sm">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* Logo Section */}
      <div className="relative z-10 px-6 pt-8 pb-6 border-b border-gray-200/60">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pesabu-teal to-pesabu-teal/80 rounded-2xl blur-lg opacity-50" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-pesabu-teal via-pesabu-teal/90 to-pesabu-teal/80 flex items-center justify-center shadow-lg shadow-pesabu-teal/20">
              <span className="text-xl font-bold text-white">P</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Pesabu
            </h1>
            <p className="text-xs text-gray-500 font-medium">Financial Intelligence</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="mb-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navigation
          </p>
        </div>
        {sidebarLinks.map((link, index) => {
          const isActive =
            pathname === link.href ||
            pathname?.startsWith(link.href + "/") ||
            index === activeIndex;

          return (
            <Link key={index} href={link.href} onClick={handleLinkClick}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveIndex(index)}
                className="relative group"
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      initial={false}
                      className="absolute inset-0 bg-gradient-to-r from-pesabu-teal/10 via-pesabu-teal/8 to-transparent rounded-xl border-l-2 border-pesabu-teal"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </AnimatePresence>
                <div
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "text-pesabu-teal"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                  )}
                >
                  <div
                    className={cn(
                      "relative z-10 transition-all duration-200",
                      isActive && "scale-110"
                    )}
                  >
                    <link.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive
                          ? "text-pesabu-teal"
                          : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                  </div>
                  <span className="relative z-10 font-medium text-sm flex-1">
                    {link.text}
                  </span>
                  {link.badge && (
                    <span className="relative z-10 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-pesabu-gold/20 to-pesabu-gold/10 text-pesabu-gold rounded-md border border-pesabu-gold/20">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="relative z-10"
                    >
                      <ChevronRight className="h-4 w-4 text-pesabu-teal" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Premium Upgrade Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-pesabu-gold/10 via-pesabu-gold/5 to-transparent border border-pesabu-gold/20 shadow-lg shadow-pesabu-gold/5 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-pesabu-gold/5 rounded-full blur-2xl" />
        <div className="relative">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-pesabu-gold/20 to-pesabu-gold/10 border border-pesabu-gold/20">
              <Crown className="h-4 w-4 text-pesabu-gold" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">
                Unlock Premium
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Advanced analytics & insights
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-pesabu-gold to-pesabu-gold/90 text-white text-xs font-semibold shadow-md shadow-pesabu-gold/20 hover:shadow-lg hover:shadow-pesabu-gold/30 transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Upgrade Now</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="relative z-10 mt-auto border-t border-gray-200/60 bg-gradient-to-b from-transparent to-gray-50/30 pt-4 pb-6 px-4 space-y-1">
        {/* Settings & Billing */}
        {footerLinks.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={index} href={item.href} onClick={handleLinkClick}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-2.5 py-2.5 px-4 text-sm rounded-xl transition-all duration-200",
                  isActive
                    ? "text-pesabu-teal bg-pesabu-teal/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.text}</span>
              </motion.div>
            </Link>
          );
        })}

        {/* User Profile Section */}
        <div className="mt-4 pt-4 border-t border-gray-200/60">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pesabu-teal to-pesabu-teal/80 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-pesabu-teal via-pesabu-teal/90 to-pesabu-teal/80 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-pesabu-teal/20">
                {getUserInitials()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.username ||
                  (typeof window !== "undefined"
                    ? localStorage.getItem("statementClientName") || "User"
                    : "User")}
              </p>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user?.email || "Member"}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-pesabu-teal transition-colors" />
          </motion.div>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2.5 py-2.5 px-4 text-sm rounded-xl transition-all duration-200 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 border border-red-200 hover:border-red-600 font-medium mt-2 shadow-sm hover:shadow-md"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );

  // Mobile: Use Sheet component
  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className="w-72 p-0 border-r border-gray-200/60">
          <div className="h-full overflow-y-auto">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <div className="relative w-72 h-screen bg-gradient-to-b from-white via-gray-50/30 to-white border-r border-gray-200/60 flex flex-col shadow-xl shadow-gray-900/5 backdrop-blur-sm">
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
