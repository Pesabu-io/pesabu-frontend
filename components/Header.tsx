'use client';

import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";



function Header() {
  return (
    <header className="bg-white shadow-sm">
          <div className="flex justify-end items-center p-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium"> Doe</p>
                <p className="text-xs text-gray-500">CompanyX</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>
  )
}

export default Header