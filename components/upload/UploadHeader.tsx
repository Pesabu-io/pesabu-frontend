'use client';

import React from 'react';
import { motion } from 'framer-motion';

const UploadHeader = () => {
  return (
    <div className="mb-8">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-pesabu-teal"
      >
        Statement Upload
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-gray-500 mt-2"
      >
        Upload your M-PESA statement to get personalized financial insights
      </motion.p>
    </div>
  );
};

export default UploadHeader;
