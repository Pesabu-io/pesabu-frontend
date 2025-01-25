import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Repeat, TrendingUp } from "lucide-react";

const TransactionSummary = () => {
  const summaryData = [
    {
      title: "Total Sent",
      value: "KES 245,000",
      change: "+11.5%",
      icon: <ArrowUpRight className="h-4 w-4 text-green-500" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Received",
      value: "KES 148,000",
      change: "-4.2%",
      icon: <ArrowDownRight className="h-4 w-4 text-red-500" />,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Total Transactions",
      value: "1,245",
      change: "+2.3%",
      icon: <Repeat className="h-4 w-4 text-blue-500" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Average Amount",
      value: "KES 12,500",
      change: "+8.1%",
      icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryData.map((item, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{item.title}</span>
            <div className={`p-2 rounded-full ${item.bgColor}`}>{item.icon}</div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-gray-900">
              {item.value}
            </span>
            <span className={`text-sm ${item.textColor} flex items-center`}>
              {item.change}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TransactionSummary;