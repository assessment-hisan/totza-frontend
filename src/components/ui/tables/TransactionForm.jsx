import React, { useState } from 'react';

const TransactionForm = ({ accounts, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    type: 'Debit',
    amount: '',
    account: '',
    vendor: '',
    item: '',
    purpose: '',
    files: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      setFormData({ ...formData, files: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'files') {
        value.forEach((file) => data.append('files', file));
      } else {
        data.append(key, value);
      }
    });

    try {
      await onSubmit(data);
      setFormData({
        date: '',
        type: 'Debit',
        amount: '',
        account: '',
        vendor: '',
        item: '',
        purpose: '',
        files: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-5 space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">New Transaction</h2>

      {/* Date Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Date *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Amount Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Amount *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Transaction Type */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Type *</label>
        <div className="flex gap-2">
          {['Debit', 'Credit'].map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setFormData({ ...formData, type })}
              className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
                formData.type === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Account Select */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Account *</label>
        <select
          name="account"
          value={formData.account}
          onChange={handleChange}
          
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Account</option>
          {accounts?.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vendor Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Vendor</label>
        <input
          type="text"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Vendor name"
        />
      </div>

      {/* Item Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Item</label>
        <input
          type="text"
          name="item"
          value={formData.item}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Item purchased"
        />
      </div>

      {/* Purpose Textarea */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Purpose *</label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Transaction purpose..."
        />
      </div>

    

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Save Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;