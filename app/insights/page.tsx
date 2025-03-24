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
import { CreditCard, FileText, User, Mail, Phone, Calendar,  } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  const [client, setClient] = useState();
  const [number, setNumber] = useState();

  const {  insights } = useTransactionData();
  const { data,  } = useFinancialInstitutionsData();
  
  console.log(insights?.totalTransactions)
  
  const handleDownload = () => {
    console.log("Downloading document...");
    // Add your download logic here
  };

  const handleViewDetails = () => {
    console.log("Viewing document details...");
    // Add your navigation logic here
  };

  const creditScore = data?.creditScore?.credit_score;

  console.log(creditScore)


  const metrics = [
    { title: "Total Transactions", value: insights?.totalTransactions, icon: <CreditCard className="w-6 h-6 text-primary" /> },
    { title: "Amount Transacted", value: insights?.totalTransacted, icon: <FileText className="w-6 h-6 text-primary" /> },
    { title: "Financial Institutions", value: "25", icon: <User className="w-6 h-6 text-primary" /> },
    { title: "Locations Mapped", value: "10", icon: <Mail className="w-6 h-6 text-primary" /> },
    { title: "Utilities Mapped", value: "10", icon: <Phone className="w-6 h-6 text-primary" /> },
    { title: "Credit Score Analysis", value: creditScore, icon: <Calendar className="w-6 h-6 text-primary" /> },
  ];

  useEffect(() => {
    const clientName = localStorage.getItem('statementClientName');
    const mobileNumber = localStorage.getItem('statementMobileNumber');
    
    console.log(clientName)
    console.log(mobileNumber)
    setClient(clientName)
    setNumber(mobileNumber)

    // Use the values
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


  const tabs = ["Summary", "Transactions", "Financial Institutions", "Lifestyle", "Utility"];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        
        <main className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Document Info Section */}
            <DocumentInfo 
        documentInfo={documentInfo}
        onDownload={handleDownload}
        onViewDetails={handleViewDetails}
      />

          
<div className="relative mb-8">
  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>
  
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
              key={tab}
              value={tab}
              className={`
                group relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                ${tab === activeTab 
                  ? "text-primary bg-white shadow-md border border-gray-100" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"}
              `}
            >
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100"
                initial={false}
                animate={tab === activeTab ? { opacity: 0.12 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                {/* You could add icons here before the text */}
                <span>{tab}</span>
                
                {/* Indicator dot */}
                {tab === activeTab && (
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
</div>

{/* Tab Content with Enhanced Transitions */}
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
    
    {/* Content card */}
    <Card className="relative bg-white/95 backdrop-blur-sm overflow-hidden rounded-xl shadow-xl border border-gray-100/80 p-6">
      {/* Top decorative accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      
      {/* Tab content */}
      {activeTab === "Summary" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
            Summary Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  className="group transform transition-all duration-300 hover:shadow-lg hover:border-primary/20 bg-gradient-to-br from-white to-gray-50/80 rounded-xl overflow-hidden border border-gray-100"
                  icon={metric.icon}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "Transactions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          
          <TransactionDashboard />
        </motion.div>
      )}

      {activeTab === "Financial Institutions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
            Financial Institutions
          </h2>
          <FinancialInstitutions />
        </motion.div>
      )}

      {activeTab === "Lifestyle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
            Lifestyle Analysis
          </h2>
          <LifestyleDashboard />
        </motion.div>
      )}

      {activeTab === "Utility" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
            Utility Management
          </h2>
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