import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ReportCard = ({ title, value, type = 'info' }) => {
  const getStyles = () => {
    switch (type) {
      case 'income':
        return {
          icon: <ArrowUpRight className="text-green-600" />,
          bg: 'bg-green-50',
          text: 'text-green-700',
        };
      case 'expense':
        return {
          icon: <ArrowDownRight className="text-red-600" />,
          bg: 'bg-red-50',
          text: 'text-red-700',
        };
      default:
        return {
          icon: null,
          bg: 'bg-gray-100',
          text: 'text-gray-800',
        };
    }
  };

  const { icon, bg, text } = getStyles();

  return (
    <div className={`w-full  px-2 py-4 rounded-2xl shadow-md ${bg} flex items-center justify-between`}>
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className={`text-2xl font-bold ${text}`}>{value}</p>
      </div>
      {icon && <div>{icon}</div>}
    </div>
  );
};

export default ReportCard;
