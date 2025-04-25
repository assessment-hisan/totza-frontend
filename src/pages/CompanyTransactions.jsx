import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/ui/tables/TransactionForm';
import TransactionTable from '../components/ui/tables/TransactionTable';
import Modal from '../components/ui/modals/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CompanyTransactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const companyTransactions = [{
    _id: 'txn-1',
    type: 'credit',
    amount: 1000,
    account: { name: 'Main Account' },
    vendor: { name: 'Vendor A' },
    purpose: 'Purchase',
    addedBy: { name: 'John Doe' },
    createdAt: new Date().setHours(0, 0, 0, 0), // Today
  },
  {
    _id: 'txn-2',
    type: 'debit',
    amount: 500,
    account: { name: 'Main Account' },
    vendor: { name: 'Vendor B' },
    purpose: 'Refund',
    addedBy: { name: 'Jane Doe' },
    createdAt: new Date().setHours(0, 0, 0, 0), // Today
  },
  {
    _id: 'txn-3',
    type: 'credit',
    amount: 2000,
    account: { name: 'Secondary Account' },
    vendor: { name: 'Vendor C' },
    purpose: 'Deposit',
    addedBy: { name: 'John Doe' },
    createdAt: new Date().setHours(0, 0, 0, 0), // Today
  },

  // Yesterday's Transactions
  {
    _id: 'txn-4',
    type: 'debit',
    amount: 800,
    account: { name: 'Main Account' },
    vendor: { name: 'Vendor D' },
    purpose: 'Payment',
    addedBy: { name: 'Jane Doe' },
    createdAt: new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000), // Yesterday
  },
  {
    _id: 'txn-5',
    type: 'credit',
    amount: 1500,
    account: { name: 'Secondary Account' },
    vendor: { name: 'Vendor E' },
    purpose: 'Transfer',
    addedBy: { name: 'John Doe' },
    createdAt: new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000), // Yesterday
  },

  // Transactions from Two Days Ago
  {
    _id: 'txn-6',
    type: 'debit',
    amount: 1200,
    account: { name: 'Main Account' },
    vendor: { name: 'Vendor F' },
    purpose: 'Expense',
    addedBy: { name: 'Jane Doe' },
    createdAt: new Date(new Date().setHours(0, 0, 0, 0) - 48 * 60 * 60 * 1000), // Two days ago
  },
  {
    _id: 'txn-7',
    type: 'credit',
    amount: 2500,
    account: { name: 'Secondary Account' },
    vendor: { name: 'Vendor G' },
    purpose: 'Deposit',
    addedBy: { name: 'John Doe' },
    createdAt: new Date(new Date().setHours(0, 0, 0, 0) - 48 * 60 * 60 * 1000), // Two days ago
  },

  // More Transactions for the Month
  {
    _id: 'txn-8',
    type: 'debit',
    amount: 900,
    account: { name: 'Main Account' },
    vendor: { name: 'Vendor H' },
    purpose: 'Payment',
    addedBy: { name: 'Jane Doe' },
    createdAt: new Date(new Date().setHours(0, 0, 0, 0) - 72 * 60 * 60 * 1000), // Three days ago
  },
  {
    _id: 'txn-9',
    type: 'credit',
    amount: 3000,
    account: { name: 'Secondary Account' },
    vendor: { name: 'Vendor I' },
    purpose: 'Transfer',
    addedBy: { name: 'John Doe' },
    createdAt: new Date(new Date().setHours(0, 0, 0, 0) - 72 * 60 * 60 * 1000), // Three days ago
  },]
  // Open modal if query param is set
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openForm') === 'true') {
      setIsModalOpen(true);
    }
  }, [location.search]);

  // Fetch accounts, vendors, and transactions
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [accRes, vendorRes, txnRes] = await Promise.all([
  //         axios.get('/api/accounts/company'),
  //         axios.get('/api/vendors'),
  //         axios.get('/api/transactions/company'),
  //       ]);
  //       setAccounts(accRes.data);
  //       setVendors(vendorRes.data);
  //       setCompanyTransactions(txnRes.data);
  //     } catch (err) {
  //       console.error('Error fetching data:', err);
  //     }
  //   };
  //   fetchData();
  // }, []);

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
      // const res = await axios.post('/api/transactions/company', formData);
      // setCompanyTransactions((prev) => [res.data, ...prev]);
      handleModalClose();
    } catch (err) {
      console.error('Failed to add transaction:', err);
    }
  };

  return (
    <div className="lg:p-4 space-y-6">
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
        <TransactionTable type="company" transactions={companyTransactions} />
      </div>

      {/* Modal for Adding Transaction */}
      {isModalOpen && (
        <Modal 
        
        isOpen={isModalOpen}
        onClose={handleModalClose}>
          <TransactionForm
            type="company"
            accounts={accounts}
            vendors={vendors}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
    </div>
  );
};

export default CompanyTransactions;
