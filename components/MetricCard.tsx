import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const MetricCard = ({ 
  title, 
  value, 
  className = "", 
  icon, 
  trend,
  subtitle 
}: MetricCardProps) => {
  // Format numbers with commas if the value is a number
  const formattedValue = typeof value === 'number' 
    ? new Intl.NumberFormat('en-US').format(value)
    : value;

  return (
    <div className={`bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-gray-500 text-xs sm:text-sm font-medium">{title}</h3>
        {icon && <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">{icon}</div>}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900">{formattedValue}</div>
      
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
      
      {trend && (
        <div className="mt-3 flex items-center">
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
          <span className="text-xs text-gray-400 ml-2">vs. last period</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;