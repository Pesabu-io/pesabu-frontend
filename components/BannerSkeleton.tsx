import React from "react";

const BannerSkeleton: React.FC = () => {
  return (
    <div className="text-foreground p-6 rounded-lg mb-6 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="h-8 bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-40"></div>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-10 w-32 bg-gray-700 rounded-full"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSkeleton;
