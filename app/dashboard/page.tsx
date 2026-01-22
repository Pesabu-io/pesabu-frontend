"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const Index = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="flex-1 overflow-auto">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-teal-600 text-white p-4 sm:p-6 md:p-8 rounded-lg mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Hey, {user?.username || "User"}</h2>
                <p className="text-sm sm:text-base">Welcome to Pesabu!</p>
              </div>

              <div className="flex justify-center sm:justify-end mb-8 sm:mb-12">
                <Image
                  src="/lovable-uploads/62091416-32c4-49fb-af5e-73c65d9efa05.png"
                  alt="Illustration"
                  width={256}
                  height={256}
                  className="w-48 sm:w-56 md:w-64"
                />
              </div>

              <div className="space-y-6">
                <div className="border border-teal-200 rounded-lg">
                  <h3 className="text-xl font-semibold text-teal-700 p-4 border-b border-teal-200">
                    Previous Reports
                  </h3>
                  <div className="p-4 text-gray-500">
                    Your analysis reports will show here
                  </div>
                </div>

                <div className="border border-teal-200 rounded-lg">
                  <h3 className="text-xl font-semibold text-teal-700 p-4 border-b border-teal-200">
                    Loan Reports
                  </h3>
                  <div className="p-4 text-gray-500">
                    Your Loan reports will show here
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;