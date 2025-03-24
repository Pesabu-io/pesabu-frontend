import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

export const SummaryCard = ({ title, value, change, icon, bgColor, textColor }: SummaryCardProps) => (
  <Card className="overflow-hidden border-l-4" >
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-full ${bgColor} transform transition-transform hover:scale-110`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-bold tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        <span className={`text-sm ${textColor} flex items-center font-medium`}>
          {change}
        </span>
      </div>
    </CardContent>
  </Card>
);