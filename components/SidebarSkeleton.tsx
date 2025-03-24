"use client";

import React from "react";

const SidebarSkeleton: React.FC = () => {
  return (
    <div className="relative h-screen bg-white shadow-xl overflow-hidden border-r border-gray-100">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-pesabu-teal/5 via-white to-pesabu-gold/5 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/3 -left-24 w-48 h-48 bg-pesabu-teal/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 -right-24 w-48 h-48 bg-pesabu-gold/10 rounded-full blur-xl"></div>
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <pattern id="sidebar-pattern-circles" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="6" cy="6" r="1" fill="none" stroke="#0E797D" strokeWidth="0.5"></circle>
          </pattern>
          <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#sidebar-pattern-circles)"></rect>
        </svg>
      </div>

      {/* Logo area - skeleton */}
      <div className="p-6 mb-6 relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 rounded-full bg-gradient-to-br from-pesabu-teal/50 to-pesabu-teal/30 flex items-center justify-center shadow-md animate-pulse"></div>
          <div className="w-24 h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Navigation - skeleton */}
      <nav className="px-4 flex-1 space-y-2 relative z-10">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`
              relative rounded-xl overflow-hidden
              ${index === 0 ? 'bg-gradient-to-r from-pesabu-teal/10 to-pesabu-teal/5 border-l-4 border-pesabu-teal/50' : 'bg-gray-50'}
            `}
          >
            <div className="flex items-center py-3 px-4">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gray-300 to-gray-200 animate-pulse"></div>
              <div className="ml-4 w-24 h-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </nav>

      {/* Premium Feature Callout - skeleton */}
      <div className="mx-4 my-6 p-4 rounded-xl bg-gradient-to-br from-pesabu-gold/10 to-pesabu-gold/5 border border-pesabu-gold/10 relative z-10">
        <div className="flex items-start space-x-3">
          <div className="h-8 w-8 rounded-full bg-pesabu-gold/10 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gradient-to-r from-pesabu-gold/40 to-pesabu-gold/20 rounded animate-pulse"></div>
            <div className="h-2 w-28 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mt-3 h-6 w-full rounded-lg bg-pesabu-gold/10 animate-pulse"></div>
      </div>

      {/* Footer - skeleton */}
      <div className="mt-auto border-t border-gray-100 pt-4 pb-6 px-4 space-y-1 relative z-10">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="flex items-center py-3 px-4 rounded-xl"
          >
            <div className="w-5 h-5 rounded-md bg-gray-300 animate-pulse"></div>
            <div className="ml-4 w-16 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
        ))}
        
        <div className="mt-6 px-4 py-3 flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="ml-3 space-y-1.5">
            <div className="h-2 w-16 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-2 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;