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
  

  
  
  export const mainMenuItems = [
    { name: "Home", icon: HomeIcon, href: "/", color: "text-blue-500" },
    { name: "Mpesa Analyzer", icon: PackageSearch, href: "/products", color: "text-green-500" },
    

 
    { name: "Loan Management System", icon: List, href: "/orders", color: "text-red-500" },
    
  { name: "Credit Scoring Engine", icon: ChartPie, href: "/reports", color: "text-purple-500" },


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
  

  

