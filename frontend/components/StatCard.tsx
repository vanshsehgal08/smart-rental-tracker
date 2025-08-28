'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  change: string;
  changeType: 'positive' | 'negative';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeType,
}) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        {changeType === 'positive' ? (
          <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${
          changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
        }`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;
