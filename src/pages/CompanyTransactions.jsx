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

  const companyTransactions = [{ _id: '10', type: 'credit', amount: 7000, purpose: 'Advance payment from client', account: { name: 'Client Payment' }, vendor: { name: 'ABC Traders' }, files: ['receipt1.pdf'], createdAt: '2025-04-08T10:00:00Z', }, { _id: '20', type: 'debit', amount: 1200, purpose: 'Labour charges', account: { name: 'Labour Expenses' }, vendor: { name: 'XYZ Workers' }, files: [], createdAt: '2025-04-07T14:30:00Z', }, { _id: '30', type: 'debit', amount: 300, purpose: 'Stationery purchase', account: { name: 'Office Supplies' }, vendor: { name: 'Stationery Hub' }, files: ['invoice.pdf'], createdAt: '2025-04-06T09:15:00Z', }, { _id: '1', type: 'credit', amount: 5000, purpose: 'Advance payment from client', account: { name: 'Client Payment' }, vendor: { name: 'ABC Traders' }, files: ['receipt1.pdf'], createdAt: '2025-04-08T10:00:00Z', }, { _id: '2', type: 'debit', amount: 1200, purpose: 'Labour charges', account: { name: 'Labour Expenses' }, vendor: { name: 'XYZ Workers' }, files: [], createdAt: '2025-04-07T14:30:00Z', }, { _id: '3', type: 'debit', amount: 300, purpose: 'Stationery purchase', account: { name: 'Office Supplies' }, vendor: { name: 'Stationery Hub' }, files: ['invoice.pdf'], createdAt: '2025-04-06T09:15:00Z', }, { _id: '4', type: 'credit', amount: 2500, purpose: 'Service payment received', account: { name: 'Service Income' }, vendor: { name: 'Client A' }, files: [], createdAt: '2025-04-05T11:45:00Z', }, { _id: '9', type: 'debit', amount: 1200, purpose: 'Labour charges', account: { name: 'Labour Expenses' }, vendor: { name: 'XYZ Workers' }, files: [], createdAt: '2025-03-07T14:30:00Z', }, { _id: '10-a', type: 'debit', amount: 300, purpose: 'Stationery purchase', account: { name: 'Office Supplies' }, vendor: { name: 'Stationery Hub' }, files: ['invoice.pdf'], createdAt: '2025-03-06T09:15:00Z', }, { _id: '10-b', type: 'credit', amount: 2500, purpose: 'Service payment received', account: { name: 'Service Income' }, vendor: { name: 'Client A' }, files: [], createdAt: '2024-04-05T11:45:00Z', }];
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
    <div className="p-4 space-y-6">
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
        <Modal onClose={handleModalClose}>
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
