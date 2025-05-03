import React, { useEffect, useState } from 'react';
import Modal from '../components/ui/modals/Modal';
import AccountForm from '../components/ui/tables/AccountForm';
import AccountTable from '../components/ui/tables/AccountTable';
import axiosInstance from '../utils/axiosInstance';
import { PlusIcon } from '@heroicons/react/24/outline';

const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const getAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('account');
      if (res.data) {
        setAccounts(res.data);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to fetch accounts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAcc = async (id) => {
    try {
      await axiosInstance.delete(`account/${id}`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.log(error);
      setError('Failed to delete account. Please try again.');
    }
  };

  const handleAccountCreated = () => {
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);
  };
  
  useEffect(() => {
    getAccounts();
  }, [refreshTrigger]);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Accounts</h1>
            <p className="text-gray-600 mt-1">Manage all your financial accounts in one place</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            Add Account
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <AccountTable accounts={accounts} onDelete={deleteAcc} />
          </div>
        )}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Account</h2>
          <AccountForm onSuccess={handleAccountCreated} />
        </div>
      </Modal>
    </div>
  );
};

export default Account;