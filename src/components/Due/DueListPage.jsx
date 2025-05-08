import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const DueListPage = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'Pending',
    fromDate: '',
    toDate: ''
  });

  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchDues = async () => {
  //     try {
  //       let url = '/api/transactions/dues?';
  //       if (filters.status) url += `status=${filters.status}&`;
  //       if (filters.fromDate) url += `fromDate=${filters.fromDate}&`;
  //       if (filters.toDate) url += `toDate=${filters.toDate}`;
        
  //       const res = await axios.get(url);
  //       setDues(res.data);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchDues();
  // }, [filters]);
  useEffect(() => {
    const fetchDues = async () => {
      // Simulate loading delay
      setLoading(true);
      setTimeout(() => {
        setDues([
          {
            _id: '1',
            vendor: 'ABC Supplies',
            purpose: 'Stationery Purchase',
            amount: 1500,
            dueDate: '2025-05-05',
            status: 'Pending'
          },
          {
            _id: '2',
            vendor: 'XYZ Services',
            purpose: 'Event Decoration',
            amount: 5000,
            dueDate: '2025-04-25',
            status: 'Partially Paid'
          },
          {
            _id: '3',
            vendor: 'PQR Caterers',
            purpose: 'Food Catering',
            amount: 7500,
            dueDate: '2025-05-10',
            status: 'Fully Paid'
          }
        ]);
        setLoading(false);
      }, 500);
    };
    fetchDues();
  }, [filters]);

  
  const getStatusBadge = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      'Partially Paid': 'bg-blue-100 text-blue-800',
      'Fully Paid': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const handlePayNow = (dueId) => {
    navigate(`/pay-due/${dueId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Due Transactions</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="">All Statuses</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({...filters, toDate: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({
                status: '',
                fromDate: '',
                toDate: ''
              })}
              className="w-full bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Due List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading dues...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dues.map((due) => (
                <tr key={due._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{due.vendor}</div>
                    <div className="text-sm text-gray-500">{due.purpose}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{due.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(due.dueDate), 'dd MMM yyyy')}
                    {new Date(due.dueDate) < new Date() && (
                      <span className="ml-2 text-xs text-red-600">Overdue</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(due.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PaymentProgress due={due} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handlePayNow(due._id)}
                      disabled={due.status === 'Fully Paid'}
                      className={`mr-2 ${due.status === 'Fully Paid' ? 
                        'text-gray-400 cursor-not-allowed' : 
                        'text-blue-600 hover:text-blue-900'}`}
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => navigate(`/dues/${due._id}`)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const PaymentProgress = ({ due }) => {
  const [paidAmount, setPaidAmount] = useState(0);
  
  useEffect(() => {
    const fetchPayments = async () => {
      const res = await axios.get(`/api/transactions/payments?dueId=${due._id}`);
      const total = res.data.reduce((sum, payment) => sum + payment.amount, 0);
      setPaidAmount(total);
    };
    fetchPayments();
  }, [due._id]);

  const percentage = Math.min(100, (paidAmount / due.amount) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span>₹{paidAmount.toFixed(2)}</span>
        <span>₹{due.amount.toFixed(2)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${
            percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
          }`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DueListPage;