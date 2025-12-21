"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SidebarSkeleton from "./SidebarSkeleton";
import { Home, PieChart, Coins, Brain, Settings, Receipt, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sidebarLinks = [
    { icon: Home, text: "Home", href: "/", active: false },
    { icon: PieChart, text: "P-insights", href: "/pinsights", active: false },
    { icon: Coins, text: "Loan Management System", href: "/loans", active: false },
    { icon: Brain, text: "Credit Scoring Engine", href: "/credit-score", active: false },
  ];

  // const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    setIsMounted(true);

    // Ensure sidebar is always visible on desktop (lg and above)
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);  // Open sidebar on desktop
      } else {
        setIsOpen(false); // Close sidebar on mobile by default
      }
    };

    // Add event listener to handle window resize
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine active index based on pathname
  useEffect(() => {
    const currentIndex = sidebarLinks.findIndex(link => pathname === link.href || pathname?.startsWith(link.href + '/'));
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname]);

  if (!isMounted) {
    return <SidebarSkeleton />;
  }

  // Shopeazz-style sidebar with original content
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <img 
            src="https://i.postimg.cc/PrkvMc05/Artboard12.png" 
            alt="Pesabu" 
            className="w-8 h-8 rounded-full"
          />
          <span className="text-lg font-semibold text-gray-900">Pesabu</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link, index) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/') || index === activeIndex;
          
          return (
            <Link key={index} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full flex items-center px-4 py-2.5 rounded-full text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/20"
                    : "text-gray-600 hover:bg-gray-50/80",
                  "hover:translate-x-1"
                )}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex items-center gap-3">
                  <link.icon
                    className={cn(
                      "h-5 w-5",
                      isActive
                        ? "text-primary"
                        : "text-gray-400"
                    )}
                  />
                  <span>{link.text}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Premium Feature Callout */}
      {isOpen && (
        <motion.div 
          className="mx-4 my-6 p-4 rounded-xl bg-gradient-to-br from-pesabu-gold/20 to-pesabu-gold/10 border border-pesabu-gold/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-full bg-pesabu-gold/20 flex items-center justify-center">
              <Brain size={16} className="text-pesabu-gold" />
            </div>
            <div>
              <h4 className="text-pesabu-gold font-medium text-sm">Premium Analytics</h4>
              <p className="text-gray-600 text-xs mt-1">Unlock advanced lending insights</p>
            </div>
          </div>
          <motion.button 
            className="mt-3 py-1.5 px-3 w-full rounded-lg bg-pesabu-gold/10 text-pesabu-gold text-xs font-medium hover:bg-pesabu-gold/20 transition-colors"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            Upgrade Now
          </motion.button>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mt-auto border-t border-gray-100 pt-4 pb-6 px-4 space-y-1">
        {[
          { icon: Settings, text: "Settings", href: "/settings" },
          { icon: Receipt, text: "Billing", href: "/billing" },
        ].map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={index} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "flex items-center gap-2 py-2 px-4 text-sm rounded-full transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/10 shadow-sm shadow-primary/20"
                    : "text-gray-500 hover:text-primary hover:bg-gray-50/80"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.text}
              </motion.div>
            </Link>
          );
        })}
        
        {/* User Profile */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center gap-3 p-2 mt-4 rounded-full bg-gray-50 cursor-pointer group transition-all duration-200 hover:bg-gray-100"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pesabu-teal to-primary text-white font-medium shadow-lg shadow-primary/20">
            {(() => {
              const clientName = typeof window !== 'undefined' ? localStorage.getItem('statementClientName') || 'User' : 'User';
              const names = clientName.split(' ');
              if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
              }
              return clientName.substring(0, 2).toUpperCase();
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {typeof window !== 'undefined' ? localStorage.getItem('statementClientName') || 'User' : 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">Analyst</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
