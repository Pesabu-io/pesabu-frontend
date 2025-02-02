'use client'
import FinancialInstitutions from "@/components/FinancialInstitutions";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import Sidebar from "@/components/Sidebar";
import TransactionsTable from "@/components/TransactionsTable";
import TransactionSummary from "@/components/TransactionSummary";
import { Card } from "@/components/ui/card";
import Utility from "@/components/Utlity";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { CreditCard, FileText, User, Mail, Phone, Calendar, Badge } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Summary");
  
  const user = {
    name: "Mike Doe",
    company: "CompanyX",
  };

  const documentInfo = {
    name: "Mike Ndegwa",
    mobile: "0723345678",
    idNumber: "36985641",
    email: "Mike123@gmail.com",
    documentType: "Mpesa Statement",
    period: "01/01/2024 - 01/03/2024",
    status: "Analysis Completed",
  };

  const metrics = [
    { title: "Total Transactions", value: "5000", icon: <CreditCard className="w-6 h-6 text-primary" /> },
    { title: "Amount Transacted", value: "1,454,000", icon: <FileText className="w-6 h-6 text-primary" /> },
    { title: "Financial Institutions", value: "25", icon: <User className="w-6 h-6 text-primary" /> },
    { title: "Locations Mapped", value: "10", icon: <Mail className="w-6 h-6 text-primary" /> },
    { title: "Utilities Mapped", value: "10", icon: <Phone className="w-6 h-6 text-primary" /> },
    { title: "Credit Score Analysis", value: "75", icon: <Calendar className="w-6 h-6 text-primary" /> },
  ];




  const tabs = ["Summary", "Transactions", "Financial Institutions", "Locations", "Utility"];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        
        <main className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Document Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Document Information</h2>
                  <Badge variant="secondary" className="px-4 py-1 text-sm">
                    {documentInfo.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">{documentInfo.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Mobile</p>
                        <p className="font-medium text-gray-900">{documentInfo.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">ID Number</p>
                        <p className="font-medium text-gray-900">{documentInfo.idNumber}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{documentInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Document Type</p>
                        <p className="font-medium text-gray-900">{documentInfo.documentType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500">Statement Period</p>
                        <p className="font-medium text-gray-900">{documentInfo.period}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <MetricCard
                    title={metric.title}
                    value={metric.value}
                    className="transform transition-all duration-300 hover:scale-105"
                    icon={metric.icon}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs Navigation */}
            <Card className="p-2 bg-white shadow-lg rounded-xl">
              <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 gap-2 bg-gray-100 p-1 rounded-lg">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${tab === activeTab ? "bg-white shadow-sm" : "hover:bg-gray-50"}`}
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </Card>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              {activeTab === "Summary" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metrics.map((metric) => (
                    <MetricCard
                      key={metric.title}
                      title={metric.title}
                      value={metric.value}
                      className="transform transition-all duration-300 hover:scale-105"
                      icon={metric.icon}
                    />
                  ))}
                </div>
              )}

              {activeTab === "Transactions" && (
                <>
                  <TransactionSummary />
                  <TransactionsTable />
                </>
              )}

              {activeTab === "Financial Institutions" && (
                <FinancialInstitutions />
              )}

              

              {activeTab === "Utility" && (
                <Utility />
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;