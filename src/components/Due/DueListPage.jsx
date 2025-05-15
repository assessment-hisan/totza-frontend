import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { format } from 'date-fns';

const DueListPage = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    paidAmount: 0,
    unpaidCount: 0,
    overdueCount: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDues = async () => {
      try {
        const res = await axiosInstance.get('due');
        setDues(res.data.data || []);
        console.log(res.data.data)
        // Calculate statistics
        const today = new Date();
        const calculatedStats = res.data.data.reduce((acc, due) => {
          const paid = due.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
          const unpaid = due.amount - paid;
          const isOverdue = new Date(due.dueDate) < today && unpaid > 0;

          return {
            totalAmount: acc.totalAmount + due.amount,
            paidAmount: acc.paidAmount + paid,
            unpaidCount: unpaid > 0 ? acc.unpaidCount + 1 : acc.unpaidCount,
            overdueCount: isOverdue ? acc.overdueCount + 1 : acc.overdueCount
          };
        }, { totalAmount: 0, paidAmount: 0, unpaidCount: 0, overdueCount: 0 });

        setStats(calculatedStats);
      } catch (error) {
        console.error('Error fetching dues:', error);
        setDues([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDues();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading dues...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header Section with Stats */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Due Transactions</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Amount Card */}
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
            <p className="text-2xl font-semibold">₹{stats.totalAmount.toFixed(2)}</p>
          </div>

          {/* Paid Amount Card */}
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Amount Paid</h3>
            <p className="text-2xl font-semibold">₹{stats.paidAmount.toFixed(2)}</p>
          </div>

          {/* Unpaid Dues Card */}
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500">Unpaid Dues</h3>
            <p className="text-2xl font-semibold">{stats.unpaidCount}</p>
          </div>

          {/* Overdue Dues Card */}
          {/* <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <p className="text-2xl font-semibold">{stats.overdueCount}</p>
          </div> */}
        </div>
      </div>

      {/* Dues Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dues?.map((due) => {
              const paidAmount = due.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
              const isOverdue = new Date(due.dueDate) < new Date() && paidAmount < due.amount;

              return (
                <tr
                  key={due._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/dues/${due._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(due.date), 'dd MMM yyyy')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(due.date), 'hh:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{due.addedBy.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{due.amount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Vendor
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {format(new Date(due.dueDate), 'dd MMM yyyy')}
                      {isOverdue && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Overdue</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${paidAmount >= due.amount ? 'bg-green-100 text-green-800' :
                        paidAmount > 0 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {paidAmount >= due.amount ? 'Fully Paid' :
                        paidAmount > 0 ? 'Partially Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DueListPage;