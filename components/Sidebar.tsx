"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SidebarSkeleton from "./SidebarSkeleton";
import { bottomMenuItems, mainMenuItems } from "@/utils/util";


const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();


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

  return (
    <>
      {/* Sidebar toggle button for mobile */}
      {!isOpen && (
  <motion.button
    className={`fixed top-4 left-4 z-50 p-2 rounded-md shadow-neumorphic lg:hidden ${
    "bg-gray-200"
    }`}
    onClick={toggleSidebar}
    whileTap={{ scale: 0.95 }}
  >
    <MenuIcon size={24} className="text-foreground" />
  </motion.button>
)}



      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            className={`fixed inset-y-0 left-0 z-40 w-60 shadow-lg flex flex-col ${
         "bg-themeTeal"
             
            }`}
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            initial="closed"
            animate="open"
            exit="closed"
            variants={{
              open: { x: 0 },
              closed: { x: "-100%" },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sidebar content */}
            <motion.div
  className="flex flex-row items-center justify-between p-6  relative"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
  <span
    className="text-sm font-semibold "
  >
      <img className="h-24 w-auto"
                src="https://www.pesabu.co.ke/images/200/12160949/Pesabunobg.png"
                alt="" />
  </span>
  
  {/* Close button: visible on mobile only */}
  <button
    className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50 lg:hidden" // Hides button on large screens
    onClick={toggleSidebar}
  >
    <XIcon size={24} className="text-foreground" />
  </button>
</motion.div>


            <nav className="flex-grow flex flex-col justify-around py-6">
              <ul className="space-y-4">
                {mainMenuItems.map((item, index) => (
                  <motion.li
                    key={item.name}
                    className="px-6 py-3"
                    initial="closed"
                    animate="open"
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 rounded-md transition-all duration-200 group ${
                         "hover:bg-gray-300 "
                      }`}
                    >
                      <item.icon
                        className={`mr-3 ${item.color} group-hover:animate-pulse`}
                        size={20}
                      />
                      <span className="font-medium tracking-wide text-sm ">
                        {item.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom Section */}
            <motion.div
              className="p-6 border-t-2 border-opacity-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-around">
                {bottomMenuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => router.push(item.href)}
                      className={`flex flex-col items-center rounded-md p-2 transition-all duration-200 group ${
                       "hover:bg-gray-300 "
                      }`}
                    >
                      <item.icon
                        className={`${item.color} group-hover:animate-pulse mb-1`}
                        size={20}
                      />
                      <span className="mt-1 text-xs font-medium ">
                        {item.name}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile view */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-background bg-opacity-50 lg:hidden backdrop-blur-sm"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

