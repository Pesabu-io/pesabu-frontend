'use client'
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import Sidebar from "@/components/Sidebar";
import TransactionsTable from "@/components/TransactionsTable";
import TransactionSummary from "@/components/TransactionSummary";
import { useState } from "react";

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
    { title: "Total Transactions", value: "5000" },
    { title: "Amount Transacted", value: "1,454,000" },
    { title: "Financial Institutions", value: "25" },
    { title: "Locations Mapped", value: "10" },
    { title: "Utilities Mapped", value: "10" },
    { title: "Credit Score Analysis", value: "75" },
  ];

  const tabs = ["Summary", "Transactions", "Financial Institutions", "Locations", "Utility"];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        
        <main className="p-6">
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{documentInfo.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-500">Mobile:</span>
                    <span className="font-medium">{documentInfo.mobile}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-500">ID Number:</span>
                    <span className="font-medium">{documentInfo.idNumber}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{documentInfo.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <span className="text-gray-500">Document type:</span>
                    <span className="font-medium">{documentInfo.documentType}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-500">Statement Period:</span>
                    <span className="font-medium">{documentInfo.period}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium text-green-600">{documentInfo.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    tab === activeTab
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Summary" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((metric) => (
                  <MetricCard
                    key={metric.title}
                    title={metric.title}
                    value={metric.value}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;