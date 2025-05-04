import React from 'react';

const TransactionRow = ({ data, onChange, accounts, index }) => {
  // Ensure all data fields have defined values
  const safeData = {
    date: data.date || '',
    type: data.type || 'Debit',
    amount: data.amount || '',
    account: data.account || '',
    vendor: data.vendor || '',
    item: data.item || '',
    purpose: data.purpose || ''
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...safeData, [name]: value };
    onChange(index, updatedData);
  };

  const handleToggle = () => {
    const newType = safeData.type === 'Debit' ? 'Credit' : 'Debit';
    const updatedData = { ...safeData, type: newType };
    onChange(index, updatedData);
  };

  // Validate the current row (this can be used to provide visual feedback)
  const isValidRow = 
    safeData.date && 
    safeData.amount && 
    Number(safeData.amount) > 0 && 
    (safeData.account || safeData.purpose);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-10 gap-3 p-3 rounded-lg border ${
      isValidRow ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
    }`}>
      {/* Date Input */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Date</label>
        <input 
          type="date" 
          name="date" 
          value={safeData.date} 
          onChange={handleChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Type Toggle */}
      <div className="md:col-span-1">
        <label className="block text-xs text-gray-500 mb-1">Type</label>
        <button
          type="button"
          onClick={handleToggle}
          className={`w-full px-3 py-2 rounded-md font-medium text-sm transition-colors ${
            safeData.type === 'Debit' 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {safeData.type}
        </button>
      </div>

      {/* Amount Input */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={safeData.amount}
          onChange={handleChange}
          placeholder="0.00"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>

      {/* Account Select */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Account</label>
        <select
          name="account"
          value={safeData.account}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vendor Input */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Vendor</label>
        <input
          type="text"
          name="vendor"
          value={safeData.vendor}
          onChange={handleChange}
          placeholder="Vendor"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>

      {/* Item Input */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Item</label>
        <input
          type="text"
          name="item"
          value={safeData.item}
          onChange={handleChange}
          placeholder="Item"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>

      {/* Purpose Input */}
      <div className="md:col-span-6">
        <label className="block text-xs text-gray-500 mb-1">Purpose</label>
        <input
          type="text"
          name="purpose"
          value={safeData.purpose}
          onChange={handleChange}
          placeholder="Purpose"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>
    </div>
  );
};

export default TransactionRow;