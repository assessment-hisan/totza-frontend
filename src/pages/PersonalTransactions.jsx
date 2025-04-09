import React, { useState } from 'react';
import TransactionForm from '../components/ui/tables/TransactionForm';
import TransactionTable from '../components/ui/tables/TransactionTable';
import Modal from '../components/ui/modals/Modal';


const PersonalTransactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const handleAddClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const personalTransactions = [
    {
      _id: 'txn_1',
      createdAt: new Date('2025-04-01T10:00:00Z'),
      type: 'credit',
      amount: 50000,
      account: { name: 'Salary Account' },
      vendor: { name: 'Company' },
      purpose: 'Salary',
      addedBy: { name: 'John Doe' },
    },
    {
      _id: 'txn_2',
      createdAt: new Date('2025-04-05T14:00:00Z'),
      type: 'debit',
      amount: 15000,
      account: { name: 'Rent Account' },
      vendor: { name: 'Landlord' },
      purpose: 'Rent',
      addedBy: { name: 'Jane Doe' },
    },
    {
      _id: 'txn_3',
      createdAt: new Date('2025-04-10T12:00:00Z'),
      type: 'debit',
      amount: 2000,
      account: { name: 'Grocery Account' },
      vendor: { name: 'Grocery Store' },
      purpose: 'Groceries',
      addedBy: { name: 'John Doe' },
    },
    {
      _id: 'txn_4',
      createdAt: new Date('2025-04-15T16:00:00Z'),
      type: 'credit',
      amount: 10000,
      account: { name: 'Bonus Account' },
      vendor: { name: 'Company' },
      purpose: 'Bonus',
      addedBy: { name: 'Jane Doe' },
    },
    {
      _id: 'txn_5',
      createdAt: new Date('2025-04-20T10:00:00Z'),
      type: 'debit',
      amount: 3000,
      account: { name: 'Utility Account' },
      vendor: { name: 'Utility Provider' },
      purpose: 'Utility Bills',
      addedBy: { name: 'John Doe' },
    },
  ];

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
        <TransactionTable transactions={personalTransactions} />
      </div>

     
     {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <TransactionForm
            type="personal"
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
