import { useState } from 'react';
import { ChevronLeft, ChevronRight, EllipsisIcon } from 'lucide-react';

const LOANS_PER_PAGE = 3;

const LoansSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const loans = [
    {
      borrower: 'Devon Lane',
      avatar: 'https://i.postimg.cc/Zq64ydVQ/fotor-ai-20241017134712.jpg',
      loanAmount: '$15,000',
      date: '2024-10-15',
      loanStatus: 'Approved',
    },
    {
      borrower: 'Courtney Henry',
      avatar: 'https://i.postimg.cc/Zq64ydVQ/fotor-ai-20241017134712.jpg',
      loanAmount: '$7,500',
      date: '2024-09-20',
      loanStatus: 'Pending',
    },
    {
      borrower: 'Cameron Williamson',
      avatar: 'https://i.postimg.cc/Zq64ydVQ/fotor-ai-20241017134712.jpg',
      loanAmount: '$10,000',
      date: '2024-09-10',
      loanStatus: 'Rejected',
    },
    {
      borrower: 'Brooklyn Simmons',
      avatar: 'https://i.postimg.cc/Zq64ydVQ/fotor-ai-20241017134712.jpg',
      loanAmount: '$12,000',
      date: '2024-08-30',
      loanStatus: 'Approved',
    },
  ];

  const totalPages = Math.ceil(loans.length / LOANS_PER_PAGE);
  const currentLoans = loans.slice(
    (currentPage - 1) * LOANS_PER_PAGE,
    currentPage * LOANS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-orange-500 bg-orange-100';
      case 'Rejected':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 shadow-lg rounded-lg bg-themeTeal shadow-lg ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Loan Reports</h1>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="py-2 px-3 rounded-full bg-gray-100  hover:bg-gray-200 transition-colors"
          >
            <EllipsisIcon size={20} />
          </button>
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white  z-20">
              <li>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  This Month
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Last Month
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Loan List */}
      <ul className="space-y-6">
        {currentLoans.map((loan, index) => (
          <li
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg bg-themeTeal transition-all hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 shadow-md flex-shrink-0">
              <img
                src={loan.avatar}
                alt={loan.borrower}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold ">
                  {loan.borrower}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${getStatusClass(
                    loan.loanStatus
                  )}`}
                >
                  {loan.loanStatus}
                </span>
              </div>
              <div className="text-sm ">
                Loan Amount: <span className="font-medium">{loan.loanAmount}</span>
              </div>
              <div className="text-sm ">Date: {loan.date}</div>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center space-x-4">
        <button
          aria-label="Previous page"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full border border-gray-300 bg-gray-200 text-gray-600 disabled:opacity-50 hover:bg-blue-500 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <span aria-live="polite" className="text-sm font-medium">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          aria-label="Next page"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full border border-gray-300 bg-gray-200 text-gray-600 disabled:opacity-50 hover:bg-blue-500 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default LoansSection;
