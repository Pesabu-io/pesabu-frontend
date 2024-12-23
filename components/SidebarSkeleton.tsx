import React from "react";

const SidebarSkeleton = () => (
  <div className="fixed inset-y-0 left-0 z-40 w-72 bg-teal-600 shadow-neumorphic flex flex-col animate-pulse">
    <div className="flex flex-row items-center justify-between p-5 border-b-2 border-blue-300 border-opacity-10">
      <div className="w-10 h-10 rounded-full bg-teal-800 mr-4"></div>
      <div className="w-20 h-4 bg-teal-800 rounded"></div>
    </div>
    <nav className="flex-grow flex flex-col justify-around py-6">
      <ul className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <li key={index} className="px-6 py-3">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-teal-800 mr-3"></div>
              <div className="w-24 h-4 bg-teal-800 rounded"></div>
            </div>
          </li>
        ))}
      </ul>
    </nav>
    <div className="p-6 border-t-2 border-blue-300 border-opacity-10">
      <div className="flex justify-around">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-teal-800 mb-1"></div>
            <div className="w-12 h-3 bg-teal-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SidebarSkeleton;
