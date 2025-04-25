import React, { useState, useMemo } from 'react';
import Modal from "../modals/Modal"; // Import your Modal component
import { Trash } from 'lucide-react';

// Helper function to group transactions by date
const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((acc, txn) => {
    const date = new Date(txn.createdAt).toLocaleDateString(); // Format date as "MM/DD/YYYY"
    if (!acc[date]) acc[date] = [];
    acc[date].push(txn);
    return acc;
  }, {});
};

// Helper function to calculate totals
const calculateTotals = (transactions) => {
  return transactions.reduce(
    (totals, txn) => {
      if (txn.type === 'credit') {
        totals.credit += txn.amount;
      } else if (txn.type === 'debit') {
        totals.debit += txn.amount;
      }
      return totals;
    },
    { credit: 0, debit: 0 }
  );
};

const TransactionTable = ({ transactions = [], onDelete }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group transactions by date
  const groupedTransactions = useMemo(() => groupTransactionsByDate(transactions), [transactions]);

  // Calculate monthly totals
  const monthlyTotals = useMemo(() => calculateTotals(transactions), [transactions]);

  // Calculate today's totals
  const todayDate = new Date().toLocaleDateString();
  const todayTransactions = groupedTransactions[todayDate] || [];
  const todayTotals = calculateTotals(todayTransactions);

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      onDelete(selectedId);
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  if (!transactions.length) {
    return <p className="text-center text-gray-500">No transactions available.</p>;
  }

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

            {/* Today's Summary Row */}
            {todayTransactions.length > 0 && (
              <tr className="bg-green-100 font-semibold">
                <td colSpan={8} className="px-4 py-2">
                  <div className="flex justify-between">
                    <span>
                      Today ({new Date().toLocaleString('en-US', { weekday: 'long' })}, {new Date().toLocaleDateString()})
                    </span>
                    <span>Total Credits: ₹{todayTotals.credit.toLocaleString()} | Total Debits: ₹{todayTotals.debit.toLocaleString()}</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Daily Groups */}
            {Object.keys(groupedTransactions).map((date) => {
              if (date === todayDate) return null; // Skip today's transactions here

              const dailyTransactions = groupedTransactions[date];
              const dailyTotals = calculateTotals(dailyTransactions);
              const dateObject = new Date(date);
              const dayOfWeek = dateObject.toLocaleString('en-US', { weekday: 'long' });

              return (
                <>
                  {/* Daily Summary Row */}
                  <tr key={`summary-${date}`} className="bg-gray-200 font-semibold">
                    <td colSpan={8} className="px-4 py-2">
                      <div className="flex justify-between">
                        <span>
                          {dayOfWeek}, {date}
                        </span>
                        <span>Total Credits: ₹{dailyTotals.credit.toLocaleString()} | Total Debits: ₹{dailyTotals.debit.toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Detailed Transaction Rows */}
                  {dailyTransactions.map((txn) => (
                    <tr key={txn._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(txn.createdAt).toLocaleDateString()}</td>
                      <td className={`px-4 py-2 font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type}
                      </td>
                      <td className="px-4 py-2">₹{txn.amount.toLocaleString()}</td>
                      <td className="px-4 py-2">{txn.account?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{txn.vendor?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{txn.purpose}</td>
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
                </>
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
        <p>Are you sure you want to delete this transaction?</p>
        <div className="flex justify-end gap-2 mt-4">
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
      </Modal>
    </>
  );
};

export default TransactionTable;
