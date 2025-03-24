"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SidebarSkeleton from "./SidebarSkeleton";
import { Home, PieChart, Coins, Brain, Settings, Receipt, ChevronDown, ChevronRight } from "lucide-react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  if (!isMounted) {
    return <SidebarSkeleton />;
  }

  const sidebarVariants = {
    expanded: { width: "18rem", transition: { duration: 0.4, ease: "easeInOut" } },
    collapsed: { width: "5rem", transition: { duration: 0.4, ease: "easeInOut" } }
  };

  return (
    <motion.div 
      initial={false}
      animate={isOpen ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className="relative h-screen bg-white shadow-xl overflow-hidden border-r border-gray-100"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-pesabu-teal/5 via-white to-pesabu-gold/5 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/3 -left-24 w-48 h-48 bg-pesabu-teal/10 rounded-full blur-xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 4, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-1/4 -right-24 w-48 h-48 bg-pesabu-gold/10 rounded-full blur-xl"
        ></motion.div>
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <pattern id="sidebar-pattern-circles" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="6" cy="6" r="1" fill="none" stroke="#0E797D" strokeWidth="0.5"></circle>
          </pattern>
          <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#sidebar-pattern-circles)"></rect>
        </svg>
      </div>

      {/* Mobile toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-4 right-4 p-1.5 rounded-full bg-pesabu-gold/10 hover:bg-pesabu-gold/20 text-pesabu-gold transition-colors lg:hidden z-20"
      >
        <ChevronDown 
          size={18} 
          className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>
      
      {/* Logo */}
      <div className="p-6 mb-6 relative z-10">
      <img src="https://i.postimg.cc/PrkvMc05/Artboard12.png" alt="Pesabu" className="w-16 h-16 md:w-24 md:h-24" />
        
      </div>



      {/* Navigation */}
      <nav className="px-4 flex-1 space-y-2 relative z-10">
        {sidebarLinks.map((link, index) => (
          <motion.div
            key={index}
            className={`
              relative rounded-xl overflow-hidden cursor-pointer
              ${index === activeIndex ? 'text-pesabu-teal' : 'text-gray-500 hover:text-pesabu-teal/90'}
            `}
            onClick={() => setActiveIndex(index)}
            whileHover={{ x: isOpen ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {index === activeIndex && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-pesabu-teal/10 to-pesabu-teal/5 rounded-xl border-l-4 border-pesabu-teal"
                layoutId="activeBackground"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <div className={`
              relative z-10 flex items-center py-3 px-4
              ${isOpen ? 'justify-start' : 'justify-center'}
            `}>
              <div className="flex items-center justify-center">
                <link.icon size={22} className={index === activeIndex ? 'text-pesabu-teal' : ''} />
              </div>
              {isOpen && (
                <motion.span 
                  className="ml-4 font-medium"
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {link.text}
                </motion.span>
              )}
              {isOpen && index === activeIndex && (
                <motion.div 
                  className="ml-auto"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight size={16} className="text-pesabu-teal" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </nav>

      {/* Premium Feature Callout */}
      {isOpen && (
        <motion.div 
          className="mx-4 my-6 p-4 rounded-xl bg-gradient-to-br from-pesabu-gold/20 to-pesabu-gold/10 border border-pesabu-gold/20 relative z-10"
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
      <div className="mt-auto border-t border-gray-100 pt-4 pb-6 px-4 space-y-1 relative z-10">
        {[
          { icon: Settings, text: "Settings" },
          { icon: Receipt, text: "Billing" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center py-3 px-4 rounded-xl text-gray-500 hover:text-pesabu-teal cursor-pointer hover:bg-pesabu-teal/5 transition-colors"
            whileHover={{ x: isOpen ? 5 : 0 }}
          >
            <div className={`flex items-center justify-center ${!isOpen && 'mx-auto'}`}>
              <item.icon size={20} />
            </div>
            {isOpen && (
              <motion.span 
                className="ml-4 font-medium text-sm"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {item.text}
              </motion.span>
            )}
          </motion.div>
        ))}
        
        {isOpen && (
          <motion.div 
            className="mt-6 px-4 py-3 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src="/api/placeholder/32/32" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-800">John Smith</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;