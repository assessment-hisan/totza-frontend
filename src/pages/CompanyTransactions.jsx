import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/ui/tables/TransactionForm';
import TransactionTable from '../components/ui/tables/TransactionTable';
import Modal from '../components/ui/modals/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const CompanyTransactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [companyTransactions, setCompanyTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const getAccounts = async () => {
    try {
      const response = await axiosInstance.get('account');
      console.log("Accounts response:", response);
      if (response.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.log("Error fetching accounts:", error);
    }
  };
  
  const getCompanyTnx = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('company');
      // console.log("Raw transactions response:", res);
      
      // Extract the data properly based on response structure
      let transactionsData = [];
      
      if (Array.isArray(res.data)) {
        // console.log("Response data is an array");
        transactionsData = res.data;
      } else if (res.data && typeof res.data === 'object') {
        // console.log("Response data is an object");
        // Check if it has a data property that's an array
        if (Array.isArray(res.data.data)) {
          transactionsData = res.data.data;
        } else {
          // Treat it as a single transaction
          transactionsData = [res.data];
        }
      }
      
      // console.log("Processed transactions data:", transactionsData);
      
      // if (transactionsData.length === 0) {
      //   console.log("Warning: No transactions found in the response");
      // }
      
      setCompanyTransactions(transactionsData);
    } catch (error) {
      console.log("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };
  
  // Open modal if query param is set
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openForm') === 'true') {
      setIsModalOpen(true);
    }
  }, [location.search]);
  
  // Open modal and update URL
  const handleAddClick = () => {
    setIsModalOpen(true);
    navigate('?openForm=true', { replace: false });
  };
  
  // Close modal and reset URL
  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/company-transactions', { replace: true });
  };
  
  // Handle transaction submission
  const handleSubmit = async (formData) => {
    try {
      console.log("Submitting new transaction:", formData);
      const res = await axiosInstance.post('company', formData);
      console.log("Transaction submission response:", res);
      
      if (res.data) {
        // Add the new transaction to the list
        setCompanyTransactions(prev => [res.data, ...prev]);
      }
      
      handleModalClose();
      // Refresh all transactions
      getCompanyTnx();
    } catch (err) {
      console.error('Failed to add transaction:', err);
    }
  };
  
  useEffect(() => {
    getAccounts();
    getCompanyTnx();
    console.log("accounts",accounts)
  }, []);
  
  // Log when transactions state changes
  useEffect(() => {
    console.log("Current company transactions state:", companyTransactions);
  }, [companyTransactions]);
  
  return (
    <div className="p-3 lg:p-4 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Transactions</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Transaction
        </button>
      </div>
      
      {/* Transaction Table */}
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <p className="text-center py-4 text-gray-500">Loading transactions...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">Total transactions: {companyTransactions.length}</p>
            <TransactionTable transactions={companyTransactions} />
          </>
        )}
      </div>
      
      {/* Modal for Adding Transaction */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="Add Transaction"
        >
          <TransactionForm
            type="company"
            accounts={accounts}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
    </div>
  );
};

export default CompanyTransactions;   