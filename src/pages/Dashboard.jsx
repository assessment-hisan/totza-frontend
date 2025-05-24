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

  // const syncMongoToGoogle = async()=> {
  //   try {
  //     const response = await axiosInstance.post("/api/trigger-report")
  //     console.log(response)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  
  // const syncMongoToGoogleSheet = async()=> {
  //   try {
  //     const response = await axiosInstance.post("/api/trigger-sync")
  //     console.log(response)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const getRecentCmpnyTns = async () => {
    try {
      const res = await axiosInstance.get("company/recent")
      if (res.data) {
        setCompanyTransactions(res.data)
         console.log(res.data)
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
    // syncMongoToGoogle()
    //  syncMongoToGoogleSheet()
   
  },[])
  
  return (
    <>
    <Navbar userInfo={userInfo} />
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        
        {/* Quick Access Cards - Mobile Optimized */}
        <div className="w-full">
          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { 
                  path: '/projects', 
                  label: 'Projects',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>,
                  color: 'text-purple-600'
                },
                { 
                  path: '/workers', 
                  label: 'Workers',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>,
                  color: 'text-blue-600'
                },
                { 
                  path: '/vendors', 
                  label: 'Vendors',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>,
                  color: 'text-green-600'
                },
                { 
                  path: '/accounts', 
                  label: 'Accounts',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>,
                  color: 'text-amber-600'
                },
                { 
                  path: '/items', 
                  label: 'Items',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>,
                  color: 'text-red-600'
                }
              ].map((card) => (
                <button
                  key={card.path}
                  onClick={() => navigate(card.path)}
                  className="flex-shrink-0 flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group min-w-20 active:scale-95"
                  aria-label={`Go to ${card.label}`}
                >
                  <span className={`p-2 rounded-lg ${card.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    {card.icon}
                  </span>
                  <span className="mt-2 text-xs font-medium text-gray-700 text-center whitespace-nowrap">{card.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-5 gap-3">
            {[
              { 
                path: '/projects', 
                label: 'Projects',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>,
                color: 'text-purple-600'
              },
              { 
                path: '/workers', 
                label: 'Workers',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>,
                color: 'text-blue-600'
              },
              { 
                path: '/vendors', 
                label: 'Vendors',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>,
                color: 'text-green-600'
              },
              { 
                path: '/accounts', 
                label: 'Accounts',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>,
                color: 'text-amber-600'
              },
              { 
                path: '/items', 
                label: 'Items',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>,
                color: 'text-red-600'
              }
            ].map((card) => (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                aria-label={`Go to ${card.label}`}
              >
                <span className={`p-2 rounded-lg ${card.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                  {card.icon}
                </span>
                <span className="mt-2 text-sm font-medium text-gray-700">{card.label}</span>
              </button>
            ))}
          </div>
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
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
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
          className='bg-gradient-to-r from-green-500 to-green-600 py-4 text-base sm:text-lg w-full h-full rounded-xl flex items-center justify-center cursor-pointer text-white font-semibold hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]'
        >
          + Add Transaction
        </button>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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