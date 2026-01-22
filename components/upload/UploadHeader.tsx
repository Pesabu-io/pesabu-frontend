'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const UploadHeader = () => {
  return (
    <div className="mb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-gradient-to-r from-pesabu-teal/10 via-pesabu-teal/5 to-transparent border border-pesabu-teal/20 rounded-full backdrop-blur-sm"
      >
        <FileText className="h-3.5 w-3.5 text-pesabu-teal" />
        <span className="text-pesabu-teal font-semibold text-sm">Statement Upload</span>
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
      >
        Upload Your M-PESA Statement
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-gray-600 text-lg leading-relaxed max-w-2xl"
      >
        Get personalized financial insights by uploading your M-PESA statement. 
        Our AI-powered analysis will help you understand your spending patterns and make smarter financial decisions.
      </motion.p>
    </div>
  );
};

export default UploadHeader;
