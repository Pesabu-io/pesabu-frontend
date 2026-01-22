'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { 
  Bell, 
  ChevronDown, 
  Search, 
  MessageSquare,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    router.replace("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const getUserInitials = () => {
    if (!user?.username) return "U";
    const names = user.username.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="relative bg-gradient-to-r from-white via-gray-50/30 to-white border-b border-gray-200/60 backdrop-blur-sm shadow-sm shadow-gray-900/5">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] [background-size:20px_20px]" />
      </div>

      <div className="relative z-10 max-w-full px-6">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Page title or breadcrumb can go here */}
          <div className="flex items-center">
            {/* Reserved for page title or breadcrumbs */}
          </div>

          {/* Right side - Search, Notifications, Messages, Profile */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <motion.div
              initial={false}
              animate={{
                width: isSearchFocused ? 280 : 240,
              }}
              className="hidden lg:flex items-center relative"
            >
              <div className={cn(
                "absolute inset-0 rounded-xl transition-all duration-200",
                isSearchFocused 
                  ? "bg-white border-2 border-pesabu-teal/30 shadow-lg shadow-pesabu-teal/10" 
                  : "bg-gray-50/80 border border-gray-200/60 hover:border-gray-300"
              )} />
              <div className="relative flex items-center w-full px-4 py-2.5">
                <Search 
                  size={18} 
                  className={cn(
                    "text-gray-400 transition-colors duration-200",
                    isSearchFocused && "text-pesabu-teal"
                  )} 
                />
                <input
                  type="text"
                  placeholder="Search..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="flex-1 ml-3 bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                />
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-md"
                  >
                    ⌘K
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Notifications Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 transition-all duration-200 group"
            >
              <Bell size={18} className="transition-transform group-hover:scale-110" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-gradient-to-r from-pesabu-teal to-pesabu-teal/80 shadow-sm shadow-pesabu-teal/30"
              />
            </motion.button>
            
            {/* Messages Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 transition-all duration-200 group"
            >
              <MessageSquare size={18} className="transition-transform group-hover:scale-110" />
            </motion.button>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200/60 mx-1" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleProfileMenu}
                className="flex items-center gap-3 cursor-pointer rounded-xl hover:bg-gray-100/60 p-2 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pesabu-teal to-pesabu-teal/80 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                  <Avatar className="relative h-10 w-10 ring-2 ring-white shadow-md">
                    <AvatarImage src="/api/placeholder/32/32" alt={user?.username || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-pesabu-teal via-pesabu-teal/90 to-pesabu-teal/80 text-white font-semibold text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {user?.email || "Member"}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </motion.div>
              </motion.div>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
                  >
                    {/* User Info Section */}
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200/60">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-pesabu-teal to-pesabu-teal/80 rounded-xl blur-md opacity-30" />
                          <Avatar className="relative h-12 w-12 ring-2 ring-white shadow-lg">
                            <AvatarImage src="/api/placeholder/32/32" alt={user?.username || "User"} />
                            <AvatarFallback className="bg-gradient-to-br from-pesabu-teal via-pesabu-teal/90 to-pesabu-teal/80 text-white font-semibold">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.username || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || "member@pesabu.io"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <motion.a
                        whileHover={{ x: 4 }}
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100/60 transition-all duration-200 group"
                      >
                        <User size={16} className="text-gray-400 group-hover:text-pesabu-teal transition-colors" />
                        <span className="font-medium">Your Profile</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ x: 4 }}
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100/60 transition-all duration-200 group"
                      >
                        <Settings size={16} className="text-gray-400 group-hover:text-pesabu-teal transition-colors" />
                        <span className="font-medium">Settings</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ x: 4 }}
                        href="#"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100/60 transition-all duration-200 group"
                      >
                        <HelpCircle size={16} className="text-gray-400 group-hover:text-pesabu-teal transition-colors" />
                        <span className="font-medium">Help & Support</span>
                      </motion.a>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200/60 my-1" />

                    {/* Logout Button */}
                    <div className="p-2">
                      <motion.button
                        whileHover={{ x: 4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group font-medium"
                      >
                        <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                        <span>Sign out</span>
                      </motion.button>
                    </div>

                    {/* Premium Badge */}
                    <div className="p-3 bg-gradient-to-r from-pesabu-gold/10 to-pesabu-gold/5 border-t border-pesabu-gold/20">
                      <div className="flex items-center gap-2 text-xs">
                        <Sparkles size={12} className="text-pesabu-gold" />
                        <span className="text-gray-600 font-medium">Upgrade to Premium</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
