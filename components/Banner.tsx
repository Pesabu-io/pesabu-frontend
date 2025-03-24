"use client";
import React, { useState, useEffect } from "react";
import { motion,  } from "framer-motion";
import BannerSkeleton from "./BannerSkeleton";


const Banner: React.FC = () => {
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
;
 
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };

    const updateDate = () => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(new Date().toLocaleDateString(undefined, options));
    };

    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    updateGreeting();
    updateDate();
    fetchData();

    const timer = setInterval(() => {
      updateGreeting();
      updateDate();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

 

  if (isLoading) {
    return <BannerSkeleton />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-foreground p-4 sm:p-6 mb-6 bg-themeTeal rounded-lg `s`hadow-lg"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"
              >
                {`${greeting},`}
              </motion.span>
              <br className="sm:hidden" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-foreground"
              >
                {" "}
                { "Guest"}
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-sm text-gray-400 font-medium"
            >
              {currentDate}
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-end w-full sm:w-auto"
          >
          
          </motion.div>
        </div>
      </motion.div>

    </>
  );
};

export default Banner;
