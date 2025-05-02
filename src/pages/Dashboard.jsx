import React, { useMemo, useState, useEffect } from 'react';
import ReportCard from "../components/ui/cards/ReportCard";
import TransactionTable from '../components/ui/tables/TransactionTable';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react'; // add this import at the top
import { Link } from 'react-router-dom';   // also make sure Link is imported
import { Users, Briefcase, Package } from 'lucide-react';
import { format, isThisWeek, isThisMonth, isThisYear, parseISO } from 'date-fns';
import axiosInstance from '../utils/axiosInstance';



const Dashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null)
  const [period, setPeriod] = useState("month");
  const [companyTransactions, setCompanyTransactions] =  useState([])
  
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

  const getRecentCmpnyTns = async () => {
    try {
      const res = await axiosInstance.get("company/recent")
      if (res.data) {
        setCompanyTransactions(res.data)
      }
    } catch (error) {
       console.log(error)
    }
  }
  // Fixed version of the transaction filtering and calculation functions

const filteredTransactions = useMemo(() => {
  // Guard against undefined companyTransactions
  if (!companyTransactions || !Array.isArray(companyTransactions)) {
    return [];
  }
  
  return companyTransactions.filter(txn => {
    // Guard against txn without createdAt
    if (!txn || !txn.createdAt) return false;
    
    const date = parseISO(txn.createdAt);
    if (period === "week") return isThisWeek(date);
    if (period === "month") return isThisMonth(date);
    if (period === "year") return isThisYear(date);
    return true;
  });
}, [companyTransactions, period]);

const formatCurrency = (amount) => `₹ ${(amount || 0).toLocaleString("en-IN")}`;

const totalIncome = useMemo(() => {
  return filteredTransactions.reduce((acc, curr) => 
    // Changed to case-insensitive comparison
    (curr.type && curr.type.toLowerCase() === 'credit') ? 
      acc + (curr.amount || 0) : acc, 0);
}, [filteredTransactions]);

const totalExpenses = useMemo(() => {
  return filteredTransactions.reduce((acc, curr) => 
    // Changed to case-insensitive comparison
    (curr.type && curr.type.toLowerCase() === 'debit') ? 
      acc + (curr.amount || 0) : acc, 0);
}, [filteredTransactions]);



  useEffect(()=>{
    getUserInfo()
    getRecentCmpnyTns()
  },[])
  
  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          
          {/* Quick Access Cards */}
          <div className="flex gap-4">
            {[
              { path: '/vendors', icon: <Users size={22} className="text-blue-600" /> },
              { path: '/accounts', icon: <Briefcase size={22} className="text-emerald-500" /> },
              { path: '/items', icon: <Package size={22} className="text-amber-500" /> },
            ].map((card) => (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                aria-label={`Go to ${card.path.slice(1)}`}
              >
                {card.icon}
              </button>
            ))}
          </div>
        </div>
  
        {/* Period Filter */}
        <div className="flex gap-3">
          {["week", "month"].map(p => (
            <button
              key={p}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                period === p
                  ? 'bg-gray-900 text-white shadow-inner'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
              }`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
  
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <ReportCard 
            title={`${period[0].toUpperCase() + period.slice(1)}ly Income`} 
            value={formatCurrency(totalIncome)} 
            type="income"
            trend="up" // Optional: add trend indicator
          />
          <ReportCard 
            title={`${period[0].toUpperCase() + period.slice(1)}ly Expenses`} 
            value={formatCurrency(totalExpenses)} 
            type="expense"
            trend="down" // Optional: add trend indicator
          />
          <button
            onClick={() => navigate('/company-transactions?openForm=true')}
            className='bg-gradient-to-r from-green-500 to-green-600 py-4 text-lg w-full h-full rounded-xl flex items-center justify-center cursor-pointer text-white font-semibold hover:shadow-lg transition-all hover:scale-[1.02]'
          >
            + Add Transaction
          </button>
        </div>
  
        {/* Recent Transactions Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
              <p className="text-sm text-gray-500">Last {period} activity</p>
            </div>
            <Link 
              to="/company-transactions" 
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <TransactionTable 
            type="company" 
            limit={5} 
            transactions={filteredTransactions} 
            className="border-none"
          />
        </div>
      </div>
    </>
  );}
  
;

export default Dashboard;