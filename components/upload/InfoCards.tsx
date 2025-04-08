'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Lock, CheckCircle2 } from 'lucide-react';

const cardData = [
  {
    icon: <FileText className="h-5 w-5 text-pesabu-gold" />,
    title: "Statement Analysis",
    description: "We analyze your transactions to provide financial insights"
  },
  {
    icon: <Lock className="h-5 w-5 text-pesabu-gold" />,
    title: "Secure Processing",
    description: "Your data is encrypted and processed securely"
  },
  {
    icon: <CheckCircle2 className="h-5 w-5 text-pesabu-gold" />,
    title: "Rich Insights",
    description: "Get personalized recommendations based on your transactions"
  }
];

const InfoCards = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="grid md:grid-cols-3 gap-6 mt-8"
    >
      {cardData.map((card, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="bg-pesabu-gold/10 rounded-full p-2 inline-flex mb-3">
            {card.icon}
          </div>
          <h3 className="font-medium text-gray-800 mb-1">{card.title}</h3>
          <p className="text-sm text-gray-500">{card.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InfoCards;
