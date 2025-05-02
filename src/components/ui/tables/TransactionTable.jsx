import React, { useState, useMemo, useEffect } from 'react';
import Modal from "../modals/Modal"; // Import your Modal component
import { Trash } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';

// Helper function to group transactions by date
const groupTransactionsByDate = (transactions) => {
  
  if (!Array.isArray(transactions) || transactions.length === 0) {
    console.log("No transactions to group or invalid format");
    return {};
  }
  
  return transactions.reduce((acc, txn) => {
    if (!txn) {
      console.log("Found null/undefined transaction");
      return acc;
    }
    
    // Handling both createdAt and date properties
    const txnDate = txn.createdAt || txn.date || new Date();
    const date = new Date(txnDate).toLocaleDateString(); // Format date as "MM/DD/YYYY"
    if (!acc[date]) acc[date] = [];
    acc[date].push(txn);
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
      
      // Handle both lowercase and uppercase type values
      const type = txn.type?.toLowerCase() || '';
      const amount = Number(txn.amount) || 0;
      
      if (type === 'Credit') {
        totals.credit += amount;
      } else if (type === 'Cebit') {
        totals.debit += amount;
      }
      return totals;
    },
    { credit: 0, debit: 0 }
  );
};

const TransactionTable = ({ transactions = [] }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedTransactions, setProcessedTransactions] = useState([]);
  
  // Process and validate transactions data
  useEffect(() => {
    
    
    // Handle different potential data structures
    let validTransactions = [];
    
    if (Array.isArray(transactions)) {
      validTransactions = transactions.filter(t => t && typeof t === 'object');
    } else if (transactions && typeof transactions === 'object') {
      // Check if it's an object with data property
      if (Array.isArray(transactions.data)) {
        validTransactions = transactions.data.filter(t => t && typeof t === 'object');
      } else {
        // Treat as single transaction
        validTransactions = [transactions];
      }
    }
    
    
    setProcessedTransactions(validTransactions);
  }, [transactions]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => 
    groupTransactionsByDate(processedTransactions), 
  [processedTransactions]);

  // Calculate monthly totals
  const monthlyTotals = useMemo(() => 
    calculateTotals(processedTransactions), 
  [processedTransactions]);

  // Calculate today's totals
  const todayDate = new Date().toLocaleDateString();
  const todayTransactions = groupedTransactions[todayDate] || [];
  const todayTotals = calculateTotals(todayTransactions);

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const deleteTnx = async (selectedId) => {
    try {
      await axiosInstance.delete(`company/${selectedId}`);
      
      // Return true to indicate successful deletion
      return true;
    } catch (error) {
      console.log("Delete error:", error);
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      const success = await deleteTnx(selectedId);
      if (success) {
        // Remove the deleted transaction from the state
        setProcessedTransactions(prev => 
          prev.filter(txn => txn._id !== selectedId)
        );
      }
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  if (!processedTransactions.length) {
    return <p className="text-center text-gray-500">No transactions available.</p>;
  }

  // Sort dates to display most recent first
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  return (
    <>
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Added By</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Monthly Summary Row */}
            <tr className="bg-blue-100 font-semibold">
              <td colSpan={8} className="px-4 py-2">
                <div className="flex justify-between">
                  <span>Monthly Summary</span>
                  <span>Total Credits: ₹{monthlyTotals.credit.toLocaleString()} | Total Debits: ₹{monthlyTotals.debit.toLocaleString()}</span>
                </div>
              </td>
            </tr>

            {/* Iterate through all dates including today */}
            {sortedDates.map((date) => {
              const dailyTransactions = groupedTransactions[date];
              const dailyTotals = calculateTotals(dailyTransactions);
              const dateObject = new Date(date);
              const dayOfWeek = dateObject.toLocaleString('en-US', { weekday: 'long' });
              const isToday = date === todayDate;

              return (
                <React.Fragment key={`date-group-${date}`}>
                  {/* Daily Summary Row */}
                  <tr className={`${isToday ? 'bg-green-100' : 'bg-gray-200'} font-semibold`}>
                    <td colSpan={8} className="px-4 py-2">
                      <div className="flex justify-between">
                        <span>
                          {isToday ? 'Today (' : ''}{dayOfWeek}, {date}{isToday ? ')' : ''}
                        </span>
                        <span>Total Credits: ₹{dailyTotals.credit.toLocaleString()} | Total Debits: ₹{dailyTotals.debit.toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Detailed Transaction Rows */}
                  {dailyTransactions.map((txn) => (
                    <tr key={txn._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(txn.createdAt || txn.date || new Date()).toLocaleDateString()}</td>
                      <td className={`px-4 py-2 font-medium ${txn.type?.toLowerCase() === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type}
                      </td>
                      <td className="px-4 py-2">₹{txn.amount}</td>
                      <td className="px-4 py-2">{txn.account?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{txn.vendor?.name || txn.vendor || 'N/A'}</td>
                      <td className="px-4 py-2">{txn.purpose || 'N/A'}</td>
                      <td className="px-4 py-2">{txn.addedBy?.name || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleOpenModal(txn._id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          <Trash />
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
        <p>Are you sure you want to delete this transaction?</p>
        <div className="flex justify-end gap-2 mt-4 ">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
        </div>
      </Modal>
    </>
  );
};

export default TransactionTable;