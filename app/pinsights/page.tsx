'use client'

import { useState } from "react";
import { CheckCircle, Link2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import { useRouter } from 'next/navigation'

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter()
  const previousReports = [
    { name: "John Doe", phone: "+254712345678", time: "19:20", status: "success" },
    { name: "James Juma", phone: "+254712345678", time: "19:20", status: "success" },
    { name: "Jane Futurama", phone: "+254712345678", time: "19:20", status: "success" },
    { name: "Advil Afuma", phone: "+254712345678", time: "19:20", status: "error" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1 overflow-auto">
      <Header />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-teal-700 mb-4">
                Unlock the Power of Your Mpesa Statements
              </h2>
              <p className="text-gray-600 text-lg">
                Discover insights from your Mpesa transactions like never before with Mpesa Analyzer
              </p>
            </div>

            <div className="flex justify-center mb-16">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative"
              >
                <Button  onClick={() => router.push("/upload")}
                  className="w-64 h-64 rounded-full bg-teal-200 hover:bg-teal-300 text-teal-800 text-3xl font-bold shadow-lg"
                >
                  Start Analysis
                </Button>
              </motion.div>
            </div>

            <div className="mt-16">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Previous Reports</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previousReports.map((report, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{report.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{report.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {report.status === "success" ? (
                            <CheckCircle className="text-green-500 h-5 w-5" />
                          ) : (
                            <XCircle className="text-red-500 h-5 w-5" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;