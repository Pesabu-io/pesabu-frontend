"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import SidebarSkeleton from "./SidebarSkeleton";
import { Home, PieChart, Coins, Brain, Settings, Receipt, ChevronDown, CheckCircle, XCircle } from "lucide-react";



const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const sidebarLinks = [
    { icon: Home, text: "Home", active: true },
    { icon: PieChart, text: "P-insights", active: false },
    { icon: Coins, text: "Loan Management System", active: false },
    { icon: Brain, text: "Credit Scoring Engine", active: false },
  ];


  const toggleSidebar = () => setIsOpen(!isOpen);

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

  // if (!isMounted) {
  //   return <SidebarSkeleton />;
  // }

  return(
    <div className="w-72 bg-teal-600 text-white p-6 flex flex-col">
    <div className="mb-12">
      <h1 className="text-3xl font-bold">Pesabu</h1>
    </div>

    <nav className="flex-1 space-y-2">
      {sidebarLinks.map((link, index) => (
        <motion.div
          key={index}
          whileHover={{ x: 10 }}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
            link.active ? "bg-teal-700" : "hover:bg-teal-700/50"
          }`}
        >
          <link.icon size={20} />
          <span>{link.text}</span>
        </motion.div>
      ))}
    </nav>

    <div className="space-y-2 mt-auto">
      <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-teal-700/50">
        <Settings size={20} />
        <span>Settings</span>
      </div>
      <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-teal-700/50">
        <Receipt size={20} />
        <span>Billing</span>
      </div>
    </div>
  </div>
  )
};

export default Sidebar;

