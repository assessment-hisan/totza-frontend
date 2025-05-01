import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { isThisWeek, isThisMonth, isThisYear, parseISO } from 'date-fns';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [period, setPeriod] = useState("month");
  
  // Sample data - replace with your API calls
  const companyTransactions = [/*...*/];
  const personalTransactions = [/*...*/];

  // Filter transactions by period
  const filterTransactions = (transactions) => {
    return transactions.filter(txn => {
      const date = parseISO(txn.createdAt);
      if (period === "week") return isThisWeek(date);
      if (period === "month") return isThisMonth(date);
      if (period === "year") return isThisYear(date);
      return true;
    });
  };

  const calculateStats = (transactions) => ({
    income: transactions.reduce((acc, curr) => curr.type === 'credit' ? acc + curr.amount : acc, 0),
    expenses: transactions.reduce((acc, curr) => curr.type === 'debit' ? acc + curr.amount : acc, 0)
  });

  const companyStats = calculateStats(filterTransactions(companyTransactions));
  const personalStats = calculateStats(filterTransactions(personalTransactions));

  return (
    <>
      <Navbar userInfo={userInfo} />
      
      <div className="p-4 md:p-6 space-y-4">
        {/* Period Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["week", "month", "year"].map(p => (
            <button
              key={p}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                period === p 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Transaction Cards - Horizontal on desktop, Vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Transactions Card */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Company</h3>
              <button 
                onClick={() => navigate('/company-transactions?openForm=true')}
                className="flex items-center gap-1 text-sm bg-green-500 text-white px-3 py-1 rounded-lg"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Income</p>
                <p className="font-bold text-green-600">
                  ₹{companyStats.income.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="font-bold text-red-600">
                  ₹{companyStats.expenses.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => navigate('/company-transactions')}
                className="flex items-center text-sm text-blue-500"
              >
                View all <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Personal Transactions Card */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Personal</h3>
              <button 
                onClick={() => navigate('/personal-transactions?openForm=true')}
                className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1 rounded-lg"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Income</p>
                <p className="font-bold text-green-600">
                  ₹{personalStats.income.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Expenses</p>
                <p className="font-bold text-red-600">
                  ₹{personalStats.expenses.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => navigate('/personal-transactions')}
                className="flex items-center text-sm text-blue-500"
              >
                View all <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-lg mb-3">Recent Transactions</h3>
          {/* Replace with your TransactionTable component */}
          <div className="text-center text-gray-500 py-8">
            Transaction list would appear here
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
