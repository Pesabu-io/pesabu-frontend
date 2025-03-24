'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, BarChart2, Shield, Clock } from "lucide-react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const featureItems = [
    { icon: <BarChart2 size={18} />, text: "Real-time Analysis" },
    { icon: <Shield size={18} />, text: "Enhanced Risk Assessment" },
    { icon: <Clock size={18} />, text: "60% Faster Approvals" }
  ];

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center pt-20" id="home">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-pesabu-light/20 to-white z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute w-full h-full overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/4 -right-20 w-64 h-64 bg-pesabu-gold/10 rounded-full blur-2xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 3, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-1/4 -left-20 w-80 h-80 bg-pesabu-teal/10 rounded-full blur-2xl"
        ></motion.div>
        <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1" fill="none" stroke="#0E797D" strokeWidth="1"></circle>
          </pattern>
          <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-3 px-4 py-1 bg-gradient-to-r from-pesabu-gold/10 to-pesabu-gold/20 rounded-full"
            >
              <span className="text-pesabu-gold font-medium">Revolutionizing Financial Decisions</span>
            </motion.div>
            
            <motion.h1 
              className="font-miniver text-pesabu-gold text-4xl md:text-5xl lg:text-6xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Data-driven lending
            </motion.h1>
            
            <motion.h2 
              className="text-pesabu-teal text-xl md:text-2xl lg:text-3xl font-semibold md:max-w-xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              See the Truth in Every Transaction
            </motion.h2>
            
            <motion.p
              className="text-gray-600 md:max-w-xl mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              For too long, lenders have relied on gut feelings and incomplete information. 
              Pesabu delivers real-time statement analysis and data-driven credit scoring—so you 
              can lend smarter, faster, and with confidence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {featureItems.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
                >
                  <div className="text-pesabu-gold">{item.icon}</div>
                  <span className="text-pesabu-teal text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Button 
                className="bg-pesabu-gold hover:bg-pesabu-gold/90 text-white rounded-full transition-all duration-300 px-8 py-6 text-lg group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Demo
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight size={20} />
                  </motion.div>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pesabu-gold to-pesabu-gold/80 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></span>
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-pesabu-teal text-pesabu-teal hover:bg-pesabu-teal hover:text-white rounded-full transition-all duration-300 px-8 py-6 text-lg"
              >
                Sign in
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full max-w-lg">
              {/* Animated background elements for image */}
              <motion.div 
                className="absolute -top-10 -left-10 w-80 h-80 bg-pesabu-teal/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              ></motion.div>
              <motion.div 
                className="absolute -bottom-10 -right-10 w-80 h-80 bg-pesabu-gold/20 rounded-full mix-blend-multiply filter blur-xl opacity-70"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -5, 0],
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              ></motion.div>
              
              <div className="relative">
                {/* Main image with card overlay */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isLoaded ? 0 : 20, opacity: isLoaded ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <motion.img 
                    src="https://i.postimg.cc/Y93ZyTbB/75d23e0ff1b64f2cbc8f96f4f4cb389b.jpg" 
                    alt="Pesabu Dashboard" 
                    className="relative rounded-2xl shadow-2xl z-10 max-w-full h-auto object-contain"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* First floating card */}
                  <motion.div 
                    className="absolute -bottom-5 -right-5 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20 border border-gray-100"
                    initial={{ x: 20, y: 20, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-pesabu-teal font-semibold">Real-time analytics</span>
                    </div>
                  </motion.div>
                  
                  {/* Second floating card */}
                  <motion.div 
                    className="absolute -top-5 -left-5 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20 border border-gray-100"
                    initial={{ x: -20, y: -20, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-pesabu-gold">
                        <BarChart2 size={18} />
                      </div>
                      <span className="text-pesabu-teal font-semibold">Data-driven decisions</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;