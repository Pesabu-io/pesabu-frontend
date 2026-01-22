'use client'

import { useEffect, useState } from "react";
import { CheckCircle, Lock, Shield, Upload, Sparkles, ArrowRight, FileText, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import ProtectedRoute from "@/components/ProtectedRoute";

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
    { icon: Lock, text: "Password Protected", color: "from-blue-500 to-blue-600" },
    { icon: Shield, text: "End-to-End Encryption", color: "from-green-500 to-green-600" },
    { icon: CheckCircle, text: "GDPR Compliant", color: "from-purple-500 to-purple-600" }
  ];

  const benefits = [
    { icon: TrendingUp, text: "Advanced Analytics", description: "Deep insights into your spending" },
    { icon: Zap, text: "Real-time Processing", description: "Instant analysis results" },
    { icon: FileText, text: "Detailed Reports", description: "Comprehensive financial reports" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto relative">
            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 z-0"></div>
            
            {/* Animated background elements */}
            <div className="absolute w-full h-full overflow-hidden pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -right-20 w-96 h-96 bg-pesabu-gold/10 rounded-full blur-3xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.3, 1] }}
                transition={{ duration: 10, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 -left-20 w-96 h-96 bg-pesabu-teal/10 rounded-full blur-3xl"
              />
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] [background-size:40px_40px]" />
              </div>
            </div>
            
            <div className="w-full px-6 py-16 relative z-10">
              <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20, scale: isLoaded ? 1 : 0.9 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-gradient-to-r from-pesabu-gold/10 via-pesabu-gold/5 to-transparent border border-pesabu-gold/20 rounded-full backdrop-blur-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-pesabu-gold" />
                  <span className="text-pesabu-gold font-semibold text-sm">P-Insights Platform</span>
                </motion.div>
                
                {/* Main Heading */}
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Unlock the Power of Your
                  <span className="block bg-gradient-to-r from-pesabu-teal to-pesabu-teal/80 bg-clip-text text-transparent">
                    M-Pesa Statements
                  </span>
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p
                  className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Discover powerful insights from your M-Pesa transactions. Our advanced AI-powered analysis 
                  helps you understand spending patterns, identify savings opportunities, and make smarter 
                  financial decisions.
                </motion.p>
                
                {/* Security Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-3 mb-12"
                >
                  {securityFeatures.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative flex items-center gap-2.5 bg-white/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-lg border border-gray-200/60 hover:border-gray-300/60 transition-all duration-200">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${item.color} bg-opacity-10`}>
                          <item.icon className={`h-4 w-4 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{item.text}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Benefits Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 w-full max-w-3xl"
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pesabu-teal/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative p-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-200">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pesabu-teal/10 to-pesabu-teal/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <benefit.icon className="h-6 w-6 text-pesabu-teal" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{benefit.text}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Upload Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20, scale: isLoaded ? 1 : 0.95 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="mb-12"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(14, 121, 125, 0.25)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    onClick={() => router.push("/upload")}
                    className="relative group"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pesabu-teal to-pesabu-teal/80 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    
                    {/* Main button */}
                    <div className="relative flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-pesabu-teal via-pesabu-teal/95 to-pesabu-teal text-white rounded-2xl shadow-2xl shadow-pesabu-teal/30 overflow-hidden">
                      {/* Animated background */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-pesabu-gold/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: isHovered ? "100%" : "-100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="h-7 w-7" />
                        </div>
                        <div className="text-left">
                          <div className="text-xl font-bold">Start Analysis</div>
                          <div className="text-sm opacity-90">Upload your M-Pesa statement</div>
                        </div>
                        <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.button>
                </motion.div>
                
                {/* Footer Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="text-gray-500 text-sm max-w-2xl mx-auto"
                >
                  <p className="leading-relaxed">
                    By uploading your statement, you agree to our{" "}
                    <Link href="/terms" className="text-pesabu-teal hover:text-pesabu-teal/80 font-medium hover:underline transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-pesabu-teal hover:text-pesabu-teal/80 font-medium hover:underline transition-colors">
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
    </ProtectedRoute>
  );
};

export default PInsights;
