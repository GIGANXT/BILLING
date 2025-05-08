import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-semibold mt-1 sm:mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-1 sm:mt-2">
              <span
                className={`text-xs sm:text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;