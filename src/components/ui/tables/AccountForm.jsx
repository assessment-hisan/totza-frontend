import React, { useState } from 'react';

const AccountForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Replace with actual API call
    console.log('Adding new account:', { name, type });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Account Name</label>
        <input
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium">Account Type</label>
        <select
          className="w-full p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="asset">Asset</option>
          <option value="liability">Liability</option>
          <option value="equity">Equity</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Save
      </button>
    </form>
  );
};

export default AccountForm;
