import {
    BarChart3Icon,
    FileText,
    FileTextIcon,
    HomeIcon,
    LogOutIcon,
    PieChartIcon,
    UserIcon,
    Video,
    Image,
    PackageSearch, Users, List, ProportionsIcon, StarIcon,
    ChartPie,
    Layers3,
    FerrisWheel
  } from "lucide-react";
  

  export const server = 'http://13.61.149.206';
  
  export const mainMenuItems = [
    { name: "Home", icon: HomeIcon, href: "/", color: "text-blue-500" },
    { name: "Mpesa Analyzer", icon: PackageSearch, href: "/products", color: "text-green-500" },
    

 
    { name: "Loan Management System", icon: List, href: "/orders", color: "text-red-500" },
    
  { name: "Credit Scoring Engine", icon: ChartPie, href: "/reports", color: "text-purple-500" },


  ];

  export const dummyReports = [
    {
      id: 1,
      customer: 'John Doe',
      bankName: 'Bank of America',
      accountNumber: '****1234',
      totalCredits: '$15,000',
      totalDebits: '$12,500',
      monthlyIncome: '$4,000',
      monthlyExpenses: '$3,500',
      date: '2024-10-01',
      status: 'Analysis Complete',
      imageUrl: 'https://i.postimg.cc/hv4hDm9D/fotor-ai-20241017162827.jpg',
    },
    {
      id: 2,
      customer: 'Jane Smith',
      bankName: 'Chase Bank',
      accountNumber: '****5678',
      totalCredits: '$20,000',
      totalDebits: '$18,000',
      monthlyIncome: '$5,500',
      monthlyExpenses: '$4,700',
      date: '2024-10-02',
      status: 'Processing',
      imageUrl: 'https://i.postimg.cc/jjzjyccq/fotor-ai-20241017162810.jpg',
    },
    {
      id: 3,
      customer: 'Michael Johnson',
      bankName: 'Wells Fargo',
      accountNumber: '****9012',
      totalCredits: '$25,000',
      totalDebits: '$22,500',
      monthlyIncome: '$7,000',
      monthlyExpenses: '$6,000',
      date: '2024-10-03',
      status: 'Delivered',
      imageUrl: 'https://i.postimg.cc/hv4hDm9D/fotor-ai-20241017162827.jpg',
    },
    {
      id: 4,
      customer: 'Alice Brown',
      bankName: 'Citi Bank',
      accountNumber: '****3456',
      totalCredits: '$12,000',
      totalDebits: '$11,000',
      monthlyIncome: '$3,800',
      monthlyExpenses: '$3,200',
      date: '2024-10-04',
      status: 'Delivered',
      imageUrl: 'https://i.postimg.cc/jjzjyccq/fotor-ai-20241017162810.jpg',
    },
    {
      id: 5,
      customer: 'David Wilson',
      bankName: 'HSBC',
      accountNumber: '****7890',
      totalCredits: '$18,000',
      totalDebits: '$15,500',
      monthlyIncome: '$5,200',
      monthlyExpenses: '$4,500',
      date: '2024-10-05',
      status: 'Analysis Complete',
      imageUrl: 'https://i.postimg.cc/hv4hDm9D/fotor-ai-20241017162827.jpg',
    },
  ];
  
  
  
  export const bottomMenuItems = [
    {

      name: "Account",
      icon: UserIcon,
      href: "/account",
      color: "text-pink-400",
    },
    {
      name: "Logout",
      icon: LogOutIcon,
      href: "/logout",
      color: "text-red-400",
    },
  ];
  

  

