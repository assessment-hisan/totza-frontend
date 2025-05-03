import React, { useEffect, useState } from 'react';
import TransactionForm from '../components/ui/tables/TransactionForm';
import TransactionTable from '../components/ui/tables/TransactionTable';
import Modal from '../components/ui/modals/Modal';
import axiosInstance from '../utils/axiosInstance';
import { Plus, } from 'lucide-react';
import { calculateMonthlyTotal, calculateTotalBalance } from '../utils/helper';
const PersonalTransactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const handleAddClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const [personalTnx, setPersonalTnx] = useState([])

  const getPersonalTnx = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('personal');
      console.log("Raw personal tnx:", res);

      // Extract the data properly based on response structure
      let transactionsData = [];

      if (Array.isArray(res.data)) {
        console.log("Response data is an array");
        transactionsData = res.data;
      } else if (res.data && typeof res.data === 'object') {
        console.log("Response data is an object");
        // Check if it has a data property that's an array
        if (Array.isArray(res.data.data)) {
          transactionsData = res.data.data;
        } else {
          // Treat it as a single transaction
          transactionsData = [res.data];
        }
      }

      console.log("Processed transactions data:", transactionsData);

      if (transactionsData.length === 0) {
        console.log("Warning: No transactions found in the response");
      }

      setPersonalTnx(transactionsData);
    } catch (error) {
      console.log("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      console.log("Submitting new transaction:", formData);
      const res = await axiosInstance.post('personal', formData);
      console.log("Transaction submission response:", res);

      if (res.data) {
        // Add the new transaction to the list
        setPersonalTnx(prev => [res.data, ...prev]);
      }

      handleModalClose();
      // Refresh all transactions
      getCompanyTnx();
    } catch (err) {
      console.error('Failed to add transaction:', err);
    }
  };

  useEffect(() => {
    getPersonalTnx()
    console.log(personalTnx)
  }, [])

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Personal Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your personal financial transactions
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
        
          <p className="text-2xl font-bold text-gray-800 mt-1">
            ₹{calculateTotalBalance(personalTnx).toLocaleString('en-IN')}
          </p>




        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">This Month</h3>
          <div className="flex justify-between mt-1">
            <div>
              <p className="text-xs text-green-600">Income</p>
              <p className="text-lg font-semibold text-green-600">
                ₹{calculateMonthlyTotal(personalTnx, 'credit').toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-red-600">Expenses</p>
              <p className="text-lg font-semibold text-red-600">
                ₹{calculateMonthlyTotal(personalTnx, 'debit').toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {personalTnx.length}
          </p>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <TransactionTable transactions={personalTnx} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <div className="p-1">
            <TransactionForm
              type="personal"
              onSubmit={handleSubmit}
              accounts={accounts}
              vendors={vendors}
              onSuccess={handleModalClose}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PersonalTransactions;
