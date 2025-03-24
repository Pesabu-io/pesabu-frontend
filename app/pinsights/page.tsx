'use client'

import { useEffect, useState } from "react";
import { CheckCircle, Lock, Shield, Upload, } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const PInsights = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const securityFeatures = [
    { icon: <Lock size={18} />, text: "Password Protected" },
    { icon: <Shield size={18} />, text: "Data Encryption" },
    { icon: <CheckCircle size={18} />, text: "GDPR Compliant" }
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto relative">
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
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-3 px-4 py-1 bg-gradient-to-r from-pesabu-gold/10 to-pesabu-gold/20 rounded-full"
              >
                <span className="text-pesabu-gold font-medium">P-Insights</span>
              </motion.div>
              
              <motion.h1 
                className=" text-pesabu-gold text-4xl md:text-5xl lg:text-6xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Unlock the Power of Your Mpesa Statements
              </motion.h1>
              
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Discover insights from your Mpesa transactions like never before. Our advanced analysis 
                helps you understand your spending patterns, identify opportunities for savings, 
                and make better financial decisions.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4 mb-8"
              >
                {securityFeatures.map((item, index) => (
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
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-10 mb-10"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  onClick={() => router.push("/upload")}
                  className="relative flex items-center justify-center w-64 h-64 rounded-full bg-gradient-to-br from-pesabu-teal to-pesabu-teal/80 text-white text-2xl font-bold shadow-xl overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <Upload size={40} className="mb-3" />
                    <span>Start Analysis</span>
                    <p className="text-sm font-normal mt-2 opacity-80">Secure & Confidential</p>
                  </div>
                  
                  {/* Button animation overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-pesabu-gold/20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: isHovered ? 1.5 : 0,
                      opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-gray-500 text-sm max-w-lg mx-auto"
              >
                <p>
                  By uploading your statement, you agree to our{" "}
                  <Link href="/terms" className="text-pesabu-teal hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-pesabu-teal hover:underline">
                    Data Protection Policy
                  </Link>
                  . Your data is encrypted and never shared with third parties.
                </p>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PInsights;