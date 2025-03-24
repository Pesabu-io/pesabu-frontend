"use client";

import React, { useState } from "react";
import { BellIcon, UserIcon,  MoonIcon, MailIcon } from "lucide-react";
import { motion } from "framer-motion";

const UserHeader: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  // Function to toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <motion.div
      className={`relative fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
         "bg-themeTeal"
      } shadow-md `}
    >
      {/* Hamburger icon placed in the left section for mobile view */}
      <div className="lg:hidden flex items-center">
        {/* Sidebar toggle button is handled in Sidebar component, make sure it's positioned correctly */}
      </div>

      {/* Empty Left Section to push right icons */}
      <div className="flex-grow"></div>

      {/* Right Section - Icons and User Info */}
      <div className="flex items-center space-x-6">
        {/* Theme Toggle Button */}
        <button>
         
            <MoonIcon size={24} className="text-gray-700" />
      
        </button>

        {/* Notification Bell */}
        <BellIcon size={24} className="text-gray-700 dark:text-gray-300" />

        {/* Message Icon */}
        <MailIcon size={24} className="text-gray-700 dark:text-gray-300" />

        {/* User Avatar and Info */}
        <div className="relative flex items-center space-x-2 cursor-pointer">
          {/* Clickable area for avatar and name */}
          <div
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
            onClick={toggleDropdown}
          >
            <UserIcon size={24} />
          </div>

          {/* User Name and Role */}
          <div onClick={toggleDropdown} className="hidden sm:flex flex-col">
            <span className="font-semibold">userName</span>
            <span className="text-sm text-gray-500">userRole</span>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 w-40 bg-white shadow-lg rounded-md py-2 z-50 dark:bg-gray-800">
              <ul className="text-left text-sm text-gray-700 dark:text-gray-200">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Account</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Settings</li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserHeader;
