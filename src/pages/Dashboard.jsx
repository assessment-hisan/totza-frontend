import React, { useMemo, useState } from 'react';
import ReportCard from "../components/ui/cards/ReportCard";
import TransactionTable from '../components/ui/tables/TransactionTable';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react'; // add this import at the top
import { Link } from 'react-router-dom';   // also make sure Link is imported
import { Users, Briefcase, Package } from 'lucide-react';
import { format, isThisWeek, isThisMonth, isThisYear, parseISO } from 'date-fns';
const companyTransactions = [
  {
    _id: '10',
    type: 'credit',
    amount: 7000,
    purpose: 'Advance payment from client',
    account: { name: 'Client Payment' },
    vendor: { name: 'ABC Traders' },
    files: ['receipt1.pdf'],
    createdAt: '2025-04-08T10:00:00Z',
  },
  {
    _id: '20',
    type: 'debit',
    amount: 1200,
    purpose: 'Labour charges',
    account: { name: 'Labour Expenses' },
    vendor: { name: 'XYZ Workers' },
    files: [],
    createdAt: '2025-04-07T14:30:00Z',
  },
  {
    _id: '30',
    type: 'debit',
    amount: 300,
    purpose: 'Stationery purchase',
    account: { name: 'Office Supplies' },
    vendor: { name: 'Stationery Hub' },
    files: ['invoice.pdf'],
    createdAt: '2025-04-06T09:15:00Z',
  },
  {
    _id: '1',
    type: 'credit',
    amount: 5000,
    purpose: 'Advance payment from client',
    account: { name: 'Client Payment' },
    vendor: { name: 'ABC Traders' },
    files: ['receipt1.pdf'],
    createdAt: '2025-04-08T10:00:00Z',
  },
  {
    _id: '2',
    type: 'debit',
    amount: 1200,
    purpose: 'Labour charges',
    account: { name: 'Labour Expenses' },
    vendor: { name: 'XYZ Workers' },
    files: [],
    createdAt: '2025-04-07T14:30:00Z',
  },
  {
    _id: '3',
    type: 'debit',
    amount: 300,
    purpose: 'Stationery purchase',
    account: { name: 'Office Supplies' },
    vendor: { name: 'Stationery Hub' },
    files: ['invoice.pdf'],
    createdAt: '2025-04-06T09:15:00Z',
  },
  {
    _id: '4',
    type: 'credit',
    amount: 2500,
    purpose: 'Service payment received',
    account: { name: 'Service Income' },
    vendor: { name: 'Client A' },
    files: [],
    createdAt: '2025-04-05T11:45:00Z',
  },
  {
    _id: '9',
    type: 'debit',
    amount: 1200,
    purpose: 'Labour charges',
    account: { name: 'Labour Expenses' },
    vendor: { name: 'XYZ Workers' },
    files: [],
    createdAt: '2025-03-07T14:30:00Z',
  },
  {
    _id: '10',
    type: 'debit',
    amount: 300,
    purpose: 'Stationery purchase',
    account: { name: 'Office Supplies' },
    vendor: { name: 'Stationery Hub' },
    files: ['invoice.pdf'],
    createdAt: '2025-03-06T09:15:00Z',
  },
  {
    _id: '10',
    type: 'credit',
    amount: 2500,
    purpose: 'Service payment received',
    account: { name: 'Service Income' },
    vendor: { name: 'Client A' },
    files: [],
    createdAt: '2024-04-08T11:45:00Z',
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("month");



  const filteredTransactions = useMemo(() => {
    return companyTransactions.filter(txn => {
      const date = parseISO(txn.createdAt);
      if (period === "week") return isThisWeek(date);
      if (period === "month") return isThisMonth(date);
      if (period === "year") return isThisYear(date);
      return true;
    });
  }, [period]);

  const formatCurrency = (amount) => `₹ ${amount.toLocaleString("en-IN")}`;

  const totalIncome = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => curr.type === 'credit' ? acc + curr.amount : acc, 0);
  }, [filteredTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => curr.type === 'debit' ? acc + curr.amount : acc, 0);
  }, [filteredTransactions]);

  const pendingReceipts = useMemo(() => {
    return filteredTransactions.filter(trans => trans.files.length === 0).length;
  }, [filteredTransactions]);

  const userInfo = {
    _id: "67d2a196c73b3e551f2ec0b8",
    fullName: "nishan",
    email: "nishan@gmail.com"
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


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <ReportCard title={`${period[0].toUpperCase() + period.slice(1)}ly Income`} value={formatCurrency(totalIncome)} type="income" />
          <ReportCard title={`${period[0].toUpperCase() + period.slice(1)}ly Expenses`} value={formatCurrency(totalExpenses)} type="expense" />
          <ReportCard title="Pending Receipts" value={pendingReceipts} />
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
  );
};

export default Dashboard;
