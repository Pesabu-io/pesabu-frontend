import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
  icon?: ReactNode;
}

const MetricCard = ({ title, value, className = "", icon }: MetricCardProps) => {
  return (
    <div className={`bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {icon && <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

export default MetricCard;
