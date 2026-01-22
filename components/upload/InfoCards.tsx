'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Lock, TrendingUp } from 'lucide-react';

const cardData = [
  {
    icon: FileText,
    title: "Statement Analysis",
    description: "Advanced AI analyzes your transactions to provide comprehensive financial insights",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100/30"
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description: "End-to-end encryption ensures your data is processed securely and privately",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-green-100/30"
  },
  {
    icon: TrendingUp,
    title: "Rich Insights",
    description: "Get personalized recommendations and actionable insights based on your transactions",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100/30"
  }
];

const InfoCards = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="grid md:grid-cols-3 gap-6 mt-12"
    >
      {cardData.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="group relative"
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          
          <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-200 h-full">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <card.icon className={`h-7 w-7 text-gray-700`} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">{card.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InfoCards;
