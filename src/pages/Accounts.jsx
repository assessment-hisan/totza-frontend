import React, { useEffect, useState } from 'react';
import Modal from '../components/ui/modals/Modal';
import AccountForm from '../components/ui/tables/AccountForm';
import AccountTable from '../components/ui/tables/AccountTable';
import axiosInstance from '../utils/axiosInstance';

const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const getAccounts = async () => {
    try {
      const res = await axiosInstance.get('account');
      if (res.data) {
        setAccounts(res.data);
        console.log(res.data)
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const deleteAcc = async (id) => {
    try {
      await axiosInstance.delete(`account/${id}`);
      // Trigger refresh after successful delete
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle account creation success
  const handleAccountCreated = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    getAccounts();
  }, [refreshTrigger]); // Only refresh when refreshTrigger changes
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Accounts</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          + Add Account
        </button>
      </div>
      
      <AccountTable accounts={accounts} onDelete={deleteAcc} />
      
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AccountForm onSuccess={handleAccountCreated} />
        </Modal>
      )}
    </div>
  );
};

export default Account;