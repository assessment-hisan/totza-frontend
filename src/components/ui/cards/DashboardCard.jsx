import React from "react";

const DashboardCard = ({ title, amount, icon, color }) => {
  return (
    <div className="p-4 rounded-2xl shadow-md bg-white flex items-center justify-between border">
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-xl font-bold text-gray-800">₹{amount.toLocaleString()}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
 
