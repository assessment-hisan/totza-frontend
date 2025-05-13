import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from "../modals/Modal";
import { Trash } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

// Helper function to group transactions by date
const groupTransactionsByDate = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {};
  }

  return transactions.reduce((acc, txn) => {
    if (!txn) return acc;

    const txnDate = txn.date ? new Date(txn.date) : new Date();
    const dateKey = txnDate.toISOString().split('T')[0]; // YYYY-MM-DD format for consistent sorting
    const formattedDate = txnDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (!acc[dateKey]) {
      acc[dateKey] = {
        formattedDate,
        transactions: []
      };
    }
    acc[dateKey].transactions.unshift(txn); // Changed from push to unshift to add to beginning
    return acc;
  }, {});
};

// Helper function to calculate totals
const calculateTotals = (transactions) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { credit: 0, debit: 0 };
  }

  return transactions.reduce(
    (totals, txn) => {
      if (!txn) return totals;

      const type = txn.type?.toLowerCase();
      const amount = Number(txn.amount) || 0;

      if (type === 'credit') {
        totals.credit += amount;
      } else if (type === 'debit' || type === 'due') {
        totals.debit += amount;
      }
      return totals;
    },
    { credit: 0, debit: 0 }
  );
};

const TransactionTable = ({ transactions = [] }) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedTransactions, setProcessedTransactions] = useState([]);

  useEffect(() => {
    // Ensure we always work with an array of transactions
    let validTransactions = [];

    if (Array.isArray(transactions)) {
      validTransactions = transactions
        .filter(t => t && typeof t === 'object')
        .map(t => ({
          ...t,
          date: t.date || t.createdAt, // Use date if available, fallback to createdAt
          account: t.account || { name: 'N/A' },
          vendor: t.vendor || { name: 'N/A' },
          addedBy: t.addedBy || { name: 'System' }
        }));
    }

    // Reverse the array to show newest first
    setProcessedTransactions(validTransactions.reverse());
  }, [transactions]);

  // Group transactions by date
  const groupedTransactions = useMemo(() =>
    groupTransactionsByDate(processedTransactions),
    [processedTransactions]);

  // Calculate monthly totals
  const monthlyTotals = useMemo(() =>
    calculateTotals(processedTransactions),
    [processedTransactions]);

  // Get today's date key for highlighting
  const todayDateKey = new Date().toISOString().split('T')[0];

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const deleteTnx = async (selectedId) => {
    try {
      await axiosInstance.delete(`company/${selectedId}`);
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      const success = await deleteTnx(selectedId);
      if (success) {
        setProcessedTransactions(prev =>
          prev.filter(txn => txn._id !== selectedId)
        );
      }
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  const handleRowClick = (txn) => {
    if (txn.type === 'Due') {
      navigate(`/dues/${txn._id}`);
    }
  };

  if (!processedTransactions.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500 text-lg">No transactions available</p>
        <p className="text-gray-400 text-sm">Add a transaction to get started</p>
      </div>
    );
  }

  // Sort dates in descending order (newest first)
  const sortedDateKeys = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Monthly Summary Row */}
            <tr className="bg-blue-50">
              <td colSpan={8} className="px-6 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-blue-800">Monthly Summary</span>
                  <div className="flex space-x-4">
                    <span className="text-sm font-medium text-green-600">
                      Credits: ₹{monthlyTotals.credit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      Debits: ₹{monthlyTotals.debit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Balance: ₹{(monthlyTotals.credit - monthlyTotals.debit).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </td>
            </tr>

            {/* Daily Transaction Groups */}
            {sortedDateKeys.map((dateKey) => {
              const { formattedDate, transactions: dailyTransactions } = groupedTransactions[dateKey];
              const dailyTotals = calculateTotals(dailyTransactions);
              const isToday = dateKey === todayDateKey;
              const date = new Date(dateKey);
              const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

              return (
                <React.Fragment key={`date-group-${dateKey}`}>
                  {/* Daily Summary Row */}
                  <tr className={isToday ? 'bg-green-50' : 'bg-gray-50'}>
                    <td colSpan={8} className="px-6 py-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold">
                            {isToday ? 'Today - ' : ''}{dayOfWeek}, {formattedDate}
                          </span>
                        </div>
                        <div className="flex space-x-4">
                          <span className="text-xs font-medium text-green-600">
                            Credits: ₹{dailyTotals.credit.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-medium text-red-600">
                            Debits: ₹{dailyTotals.debit.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Transaction Rows */}
                  {dailyTransactions.map((txn) => (
                    <tr
                      key={txn._id}
                      className={`hover:bg-gray-50 ${txn.type === 'Due' ? 'cursor-pointer hover:bg-yellow-50' : ''}`}
                      onClick={() => txn.type === 'Due' && handleRowClick(txn)}
                    >
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(txn.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          txn.type?.toLowerCase() === 'credit'
                            ? 'bg-green-100 text-green-800'
                            : txn.type === 'Due'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                        ₹{Number(txn.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {txn.account?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {txn.vendor?.name || txn.vendor || 'N/A'}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500 max-w-xs truncate">
                        {txn.purpose || 'N/A'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {txn.addedBy?.name || 'System'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(txn._id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className='p-4'>
          <p className="text-gray-700 mb-4">Are you sure you want to delete this transaction? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete Transaction
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TransactionTable;