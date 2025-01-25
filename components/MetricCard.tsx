interface MetricCardProps {
    title: string;
    value: string | number;
    className?: string;
  }
  
  const MetricCard = ({ title, value, className = "" }: MetricCardProps) => {
    return (
      <div className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
    );
  };
  
  export default MetricCard;