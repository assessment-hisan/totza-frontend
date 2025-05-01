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
  if (!userInfo) {
    return null;
  }
   return (
   
    <>
      <Navbar userInfo={userInfo} />
      <div className="p-6 space-y-6">
        
        <div className='flex  justify-between'>
        <h2 className="text-2xl font-bold">Dashboard</h2>
         {/* Navigation Cards */}
         <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-10">
          {[
            {
              path: '/vendors',
              // title: 'Vendors',
              // description: 'Manage all vendor details',
              icon: <Users size={20} color="#2563EB" /> // Blue icon for Vendors
            },
            {
              path: '/accounts',
              // title: 'Accounts',
              // description: 'Add or modify account categories',
              icon: <Briefcase size={20} color="#10B981" /> // Green icon for Accounts
            },
            {
              path: '/items',
              // title: 'Items',
              // description: 'Manage inventory items',
              icon: <Package size={20} color="#F59E0B" /> // Orange icon for Items
            },
          ].map((card) => (
            <div
              key={card.path}
              onClick={() => navigate(card.path)}
              className="bg-gray-100 cursor-pointer  rounded-xl transition-transform transform hover:-translate-y-1 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="bg-gray-300 rounded-full p-4">
                {card.icon}
              </div>

              {/* Title */}
              {/* <h3 className="text-xl font-bold mb-2">{card.title}</h3> */}

              {/* Description */}
              {/* <p className="text-sm text-gray-600">{card.description}</p> */}
            </div>
          ))}
        </div>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-4">
          {["month", "week"].map(p => (
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
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ReportCard title={`${period[0].toUpperCase() + period.slice(1)}ly Income`} value={formatCurrency(totalIncome)} type="income" />
          <ReportCard title={`${period[0].toUpperCase() + period.slice(1)}ly Expenses`} value={formatCurrency(totalExpenses)} type="expense" />
          
          <div
            onClick={() => navigate('/company-transactions?openForm=true')}
            className='bg-green-500 py-3 lg:py-5 text-lg lg:text-2xl w-full h-full rounded-xl flex items-center justify-center cursor-pointer text-white font-semibold hover:bg-green-600 transition'
          >
            + Add Transaction
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white   rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Link to="/company-transactions" className="flex items-center text-blue-600 hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <TransactionTable type="company" limit={3} transactions={filteredTransactions} />
        </div>

       



      </div>
    </>
  );}
  
;

export default Dashboard;