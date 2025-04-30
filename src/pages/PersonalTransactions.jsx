import React, { useEffect, useState } from 'react';
import TransactionForm from '../components/ui/tables/TransactionForm';
import TransactionTable from '../components/ui/tables/TransactionTable';
import Modal from '../components/ui/modals/Modal';
import axiosInstance from '../utils/axiosInstance';

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

 useEffect(()=>{
  getPersonalTnx()
  console.log(personalTnx)
 }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Personal Transactions</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Transaction
        </button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <TransactionTable transactions={personalTnx} />
      </div>

     
     {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <TransactionForm
            type="personal"
            onSubmit={handleSubmit}
            accounts={accounts}
            vendors={vendors}
            onSuccess={handleModalClose}
          />
        </Modal>
      )}
     </div>
    
  );
};

export default PersonalTransactions;
