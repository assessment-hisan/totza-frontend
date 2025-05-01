import React, { useMemo, useState, useEffect } from 'react';
import ReportCard from "../components/ui/cards/ReportCard";
import TransactionTable from '../components/ui/tables/TransactionTable';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Package } from 'lucide-react';
import { format, isThisWeek, isThisMonth, isThisYear, parseISO } from 'date-fns';
import axiosInstance from '../utils/axiosInstance';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [period, setPeriod] = useState("month");
  
  // Sample data - replace with your actual data fetching
  const companyTransactions = [
    // ... your existing company transactions data
  ];
  
  const personalTransactions = [
    {
      _id: '101',
      type: 'credit',
      amount: 50000,
      purpose: 'Monthly Salary',
      account: { name: 'Salary' },
      vendor: { name: 'Company Inc' },
      files: ['payslip.pdf'],
      createdAt: '2025-04-01T09:00:00Z',
    },
    {
      _id: '102',
      type: 'debit',
      amount: 15000,
      purpose: 'Rent Payment',
      account: { name: 'Housing' },
      vendor: { name: 'Landlord' },
      files: ['rent_receipt.pdf'],
      createdAt: '2025-04-05T12:00:00Z',
    },
    // ... more personal transactions
  ];

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('api/auth/get-user');
      if (response.data) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
      navigate('/login');
    }
  };

  const filterTransactions = (transactions) => {
    return transactions.filter(txn => {
      const date = parseISO(txn.createdAt);
      if (period === "week") return isThisWeek(date);
      if (period === "month") return isThisMonth(date);
      if (period === "year") return isThisYear(date);
      return true;
    });
  };

  const filteredCompanyTxns = useMemo(() => filterTransactions(companyTransactions), [period]);
  const filteredPersonalTxns = useMemo(() => filterTransactions(personalTransactions), [period]);

  const calculateStats = (transactions) => {
    return {
      income: transactions.reduce((acc, curr) => curr.type === 'credit' ? acc + curr.amount : acc, 0),
      expenses: transactions.reduce((acc, curr) => curr.type === 'debit' ? acc + curr.amount : acc, 0),
      pendingReceipts: transactions.filter(trans => trans.files.length === 0).length
    };
  };

  const companyStats = calculateStats(filteredCompanyTxns);
  const personalStats = calculateStats(filteredPersonalTxns);

  const formatCurrency = (amount) => `₹ ${amount.toLocaleString("en-IN")}`;

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="p-6 space-y-6">
        <div className='flex justify-between'>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-10">
            {[
              { path: '/vendors', icon: <Users size={20} color="#2563EB" /> },
              { path: '/accounts', icon: <Briefcase size={20} color="#10B981" /> },
              { path: '/items', icon: <Package size={20} color="#F59E0B" /> },
            ].map((card) => (
              <div
                key={card.path}
                onClick={() => navigate(card.path)}
                className="bg-gray-100 cursor-pointer rounded-xl transition-transform transform hover:-translate-y-1 flex flex-col items-center text-center"
              >
                <div className="bg-gray-300 rounded-full p-4">
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-4">
          {["week", "month", "year"].map(p => (
            <button
              key={p}
              className={`px-4 py-2 rounded-lg shadow-sm transition-colors
                ${period === p
                  ? 'bg-neutral-800 text-white hover:bg-primary-dark'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Company Transactions Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Company Transactions</h3>
            <button
              onClick={() => navigate('/company-transactions?openForm=true')}
              className="bg-green-500 px-4 py-2 rounded-lg text-white font-medium hover:bg-green-600 transition"
            >
              + Add Company Transaction
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ReportCard 
              title={`${period[0].toUpperCase() + period.slice(1)}ly Income`} 
              value={formatCurrency(companyStats.income)} 
              type="income" 
            />
            <ReportCard 
              title={`${period[0].toUpperCase() + period.slice(1)}ly Expenses`} 
              value={formatCurrency(companyStats.expenses)} 
              type="expense" 
            />
            <ReportCard 
              title="Pending Receipts" 
              value={companyStats.pendingReceipts} 
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-medium">Recent Company Transactions</h4>
              <Link to="/company-transactions" className="flex items-center text-blue-600 hover:underline">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <TransactionTable 
              type="company" 
              limit={3} 
              transactions={filteredCompanyTxns} 
            />
          </div>
        </div>

        {/* Personal Transactions Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Personal Transactions</h3>
            <button
              onClick={() => navigate('/personal-transactions?openForm=true')}
              className="bg-blue-500 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-600 transition"
            >
              + Add Personal Transaction
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ReportCard 
              title={`${period[0].toUpperCase() + period.slice(1)}ly Income`} 
              value={formatCurrency(personalStats.income)} 
              type="income" 
            />
            <ReportCard 
              title={`${period[0].toUpperCase() + period.slice(1)}ly Expenses`} 
              value={formatCurrency(personalStats.expenses)} 
              type="expense" 
            />
            <ReportCard 
              title="Pending Receipts" 
              value={personalStats.pendingReceipts} 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-medium">Recent Personal Transactions</h4>
              <Link to="/personal-transactions" className="flex items-center text-blue-600 hover:underline">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <TransactionTable 
              type="personal" 
              limit={3} 
              transactions={filteredPersonalTxns} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
