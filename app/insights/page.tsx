'use client'
import DocumentInfo, { DocumentStatus } from "@/components/DocInfo";
import FinancialInstitutions from "@/components/FinancialInstitutions";
import Header from "@/components/Header";
import LifestyleDashboard from "@/components/Lifestyle";
import MetricCard from "@/components/MetricCard";
import Sidebar from "@/components/Sidebar";
import TransactionDashboard from "@/components/TransactionSummary";
import { Card } from "@/components/ui/card";
import Utility from "@/components/Utlity";
import { useFinancialInstitutionsData } from "@/hooks/useFinancialInstitutionsData";
import { useTransactionData } from "@/hooks/useTransactionData";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { 
  CreditCard, 
  FileText, 
  User, 
  Calendar, 
  Download, 
  Building, 
  Activity, 
  Coffee, 
  Zap,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  const [client, setClient] = useState();
  const [number, setNumber] = useState();

  const { insights } = useTransactionData();
  const { data } = useFinancialInstitutionsData();
  
  const handleDownload = () => {
    console.log("Downloading document...");
    // Add your download logic here
  };

  const handleViewDetails = () => {
    console.log("Viewing document details...");
    // Add your navigation logic here
  };

  const creditScore = data?.creditScore?.credit_score_status;
  const creditScore1 = data?.creditScore?.credit_score;

  const uniqueBanksCount = insights?.uniqueBanksCount || 0;

  const metrics = [
    { 
      title: "Total Transactions", 
      value: insights?.totalTransactions, 
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      bgColor: "from-blue-50 to-blue-100/30" 
    },
    { 
      title: "Amount Transacted", 
      value: insights?.totalTransacted, 
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      bgColor: "from-emerald-50 to-emerald-100/30" 
    },
    { 
      title: "Financial Institutions", 
      value: uniqueBanksCount, 
      icon: <Building className="w-6 h-6 text-indigo-500" />,
      bgColor: "from-indigo-50 to-indigo-100/30" 
    },
    { 
      title: "Credit Score", 
      value: creditScore1, 
      icon: <Activity className="w-6 h-6 text-amber-500" />,
      bgColor: "from-amber-50 to-amber-100/30" 
    },
    { 
      title: "Credit Status", 
      value: creditScore, 
      icon: <FileText className="w-6 h-6 text-violet-500" />,
      bgColor: "from-violet-50 to-violet-100/30" 
    },
  ];

  useEffect(() => {
    const clientName = localStorage.getItem('statementClientName');
    const mobileNumber = localStorage.getItem('statementMobileNumber');
    
    setClient(clientName)
    setNumber(mobileNumber)
  }, []);

  const documentInfo = {
    name: client,
    mobile: number,
    idNumber: "12345678",
    email: "john.doe@example.com",
    documentType: "M-PESA Statement",
    period: "Jan 2025 - Feb 2025",
    status: "Verified" as DocumentStatus,
    dateUploaded: "March 5, 2025",
    fileSize: "1.2 MB"
  };

  const tabs = [
    { id: "Summary", icon: <FileText className="w-4 h-4 mr-2" /> },
    { id: "Transactions", icon: <CreditCard className="w-4 h-4 mr-2" /> },
    { id: "Financial Institutions", icon: <Building className="w-4 h-4 mr-2" /> },
    { id: "Lifestyle", icon: <Coffee className="w-4 h-4 mr-2" /> },
    { id: "Utility", icon: <Zap className="w-4 h-4 mr-2" /> }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        
        <main className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Decorative elements */}
            <div className="absolute top-24 right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60 z-0"></div>
            <div className="absolute bottom-24 left-24 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl opacity-60 z-0"></div>
            
            {/* Document Info Section - With Glass Effect */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 overflow-hidden border border-gray-100/80 shadow-lg rounded-2xl">
                <DocumentInfo 
                  documentInfo={documentInfo}
                  onDownload={handleDownload}
                  onViewDetails={handleViewDetails}
                />
              </Card>
            </motion.div>
            
            {/* Enhanced Tabs with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mb-6"
            >
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
              
              <Card className="bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <Tabs 
                  defaultValue={activeTab} 
                  className="w-full" 
                  onValueChange={(value) => {
                    setActiveTab(value);
                  }}
                >
                  <div className="px-4 pt-4 pb-2">
                    <TabsList className="relative grid grid-cols-5 gap-2 bg-transparent p-0">
                      {tabs.map((tab) => (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className={`
                            group relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                            ${tab.id === activeTab 
                              ? "text-primary bg-white shadow-md border border-gray-100" 
                              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"}
                          `}
                        >
                          <motion.div
                            className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100"
                            initial={false}
                            animate={tab.id === activeTab ? { opacity: 0.12 } : { opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          <motion.div
                            className="relative flex items-center justify-center"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                          >
                            {tab.icon}
                            <span>{tab.id}</span>
                            
                            {/* Animated indicator */}
                            {tab.id === activeTab && (
                              <motion.div 
                                layoutId="activeDot"
                                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                                transition={{ type: "spring", duration: 0.5 }}
                              />
                            )}
                          </motion.div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </Tabs>
              </Card>
            </motion.div>

            {/* Enhanced Tab Content with Animated Transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-100/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
                
                {/* Content card with glass effect */}
                <Card className="relative bg-white/95 backdrop-blur-sm overflow-hidden rounded-xl shadow-xl border border-gray-100/80 p-6">
                  {/* Top decorative accent */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                  
                  {/* Tab content */}
                  {activeTab === "Summary" && (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-6"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
                      >
                        <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/30 rounded-full mr-3"></div>
                        Summary Overview
                      </motion.h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {metrics.map((metric, index) => (
                          <motion.div
                            key={metric.title}
                            variants={itemVariants}
                          >
                            <MetricCard
                              title={metric.title}
                              value={metric.value}
                              className={`group transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 bg-gradient-to-br ${metric.bgColor} rounded-xl overflow-hidden border border-gray-100`}
                              icon={metric.icon}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "Transactions" && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
                      >
                        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-300 rounded-full mr-3"></div>
                        Transaction Analysis
                      </motion.h2>
                      <TransactionDashboard />
                    </motion.div>
                  )}

                  {activeTab === "Financial Institutions" && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
                      >
                        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-indigo-300 rounded-full mr-3"></div>
                        Financial Institutions
                      </motion.h2>
                      <FinancialInstitutions />
                    </motion.div>
                  )}

                  {activeTab === "Lifestyle" && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
                      >
                        <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-amber-300 rounded-full mr-3"></div>
                        Lifestyle Analysis
                      </motion.h2>
                      <LifestyleDashboard />
                    </motion.div>
                  )}

                  {activeTab === "Utility" && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.h2 
                        variants={itemVariants}
                        className="text-xl font-semibold text-gray-800 mb-4 flex items-center"
                      >
                        <div className="w-2 h-8 bg-gradient-to-b from-violet-500 to-violet-300 rounded-full mr-3"></div>
                        Utility Management
                      </motion.h2>
                      <Utility />
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;