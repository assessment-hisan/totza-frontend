import React, { useState } from 'react';
import Modal from '../components/ui/modals/Modal';
import AccountForm from '../components/ui/tables/AccountForm'; // You'll create this
import AccountTable from '../components/ui/tables/AccountTable'; // To show the list

const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data for financial accounts
  const dummyAccounts = [
    { _id: 'account_0', name: 'Cost of Goods Sold', type: 'expense' },
    { _id: 'account_1', name: 'Labour Expenses', type: 'expense' },
    { _id: 'account_2', name: 'Rent', type: 'expense' },
    { _id: 'account_3', name: 'Utilities', type: 'expense' },
    { _id: 'account_4', name: 'Sales Revenue', type: 'income' },
    { _id: 'account_5', name: 'Service Revenue', type: 'income' },
  ];

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

      {/* Pass dummy data directly to AccountTable */}
      <AccountTable accounts={dummyAccounts} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <AccountForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Account;
