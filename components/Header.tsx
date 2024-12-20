'use client';

import Link from "next/link";
import { Fragment, useState } from "react";
import { Bars3Icon , ChatBubbleLeftIcon, HomeIcon, 
    PaperAirplaneIcon,
    ChevronDownIcon, 
    PhoneIcon, PlayCircleIcon,
     XMarkIcon} from "@heroicons/react/24/solid";

import { cn } from "@/lib/utils";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";



function Header() {

    const [mobileMenuOpen , setMobileMenuOpen] = useState(false);

    const products = [
        {
            name: "Book a Stay",
            description: "Get a better understanding of your traffic",
            href: "#",
            icon: HomeIcon, 

        },
        {
            name: "Book a flight",
            description: "Speak directly to your customers",
            href: "#",
            icon: PaperAirplaneIcon
        },
        {
            name: "Contact our support team",
            description: "Your customers' data will safe and secure",
            href: "#",
            icon: ChatBubbleLeftIcon
        },
    ];

    const callsToAction = [
        { name: "See Demo Booking", href: "#", icon: PlayCircleIcon }, {
            name: "Contact Support", href: "#", icon: PhoneIcon
        }
    ]


  return (
    <header className="bg-white shadow-sm">
          <div className="flex justify-end items-center p-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium">Mike Doe</p>
                <p className="text-xs text-gray-500">CompanyX</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>
  )
}

export default Header