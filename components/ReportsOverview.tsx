'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, SquareArrowOutUpRight } from 'lucide-react';
import { dummyReports } from '@/utils/util';

const REPORTS_PER_PAGE = 5;

function ReportsOverview() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dummyReports.length / REPORTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentReports = dummyReports.slice(
    (currentPage - 1) * REPORTS_PER_PAGE,
    currentPage * REPORTS_PER_PAGE
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Analysis Complete':
        return 'text-green-600 bg-green-100';
      case 'Processing':
        return 'text-orange-500 bg-orange-100';
      case 'Failed':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-lg bg-themeTeal  shadow-lg transition-colors max-w-sm md:max-w-full`}
      role="region"
      aria-label="Recent Reports"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Recent Reports</h1>
        <button
          aria-label="View all reports"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition-all"
        >
          View All <SquareArrowOutUpRight size={20} className="ml-2" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table
          className="min-w-[640px] w-full border-collapse"
          role="table"
          aria-label="Reports Table"
        >
          <thead>
            <tr className="bg-gray-100 text-gray-900 text-left">
              <th scope="col" className="p-3">Customer</th>
              <th scope="col" className="p-3">Bank</th>
              <th scope="col" className="p-3">Credits</th>
              <th scope="col" className="p-3">Debits</th>
              <th scope="col" className="p-3">Date</th>
              <th scope="col" className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((report) => (
              <motion.tr
                key={report.id}
                whileHover={{ scale: 1.01 }}
                className="border-gray-300 hover:bg-gray-50 border-b transition-colors"
              >
                <td className="p-3">{report.customer}</td>
                <td className="p-3">{report.bankName}</td>
                <td className="p-3">{report.totalCredits}</td>
                <td className="p-3">{report.totalDebits}</td>
                <td className="p-3">{report.date}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-md ${getStatusClass(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center items-center space-x-3">
        <button
          aria-label="Previous page"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full transition-colors border-gray-300 bg-gray-200 text-gray-600 disabled:opacity-50 hover:bg-blue-500 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <span
          aria-live="polite"
          className="text-sm font-medium"
        >{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          aria-label="Next page"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full transition-colors border-gray-300 bg-gray-200 text-gray-600 disabled:opacity-50 hover:bg-blue-500 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export default ReportsOverview;
