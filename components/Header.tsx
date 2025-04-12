'use client';

import { useState } from 'react';
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
} from "lucide-react";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Title of current page */}
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-100"></h1>
          </div>

          {/* Right side - Search and profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-50 border-none focus:ring-0 focus:outline-none text-sm ml-2 w-40"
              />
            </div>
            
            <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-50 relative">
              <Bell size={16} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-pesabu-teal transform translate-x-1/4 -translate-y-1/4"></span>
            </button>
            
            <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-50">
              <MessageSquare size={16} />
            </button>

            <div className="relative">
              <div 
                className="flex items-center space-x-2 cursor-pointer rounded-lg hover:bg-gray-50 p-1"
                onClick={toggleProfileMenu}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" alt="John Smith" />
                  <AvatarFallback className="bg-pesabu-teal text-white">JS</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">John Smith</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-20">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign out</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;