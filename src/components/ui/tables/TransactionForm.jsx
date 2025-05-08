import React, { useState } from 'react';
// Assuming DueSelection is already created and imported
 import DueSelection from "../../Due/DueSelection"

const TRANSACTION_TYPES = ['Debit', 'Credit', 'Due'];

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
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [isPayingDue, setIsPayingDue] = useState(false);
  const [selectedDue, setSelectedDue] = useState(null);

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

    if (isPayingDue && selectedDue) {
      data.append('payingDueId', selectedDue._id);
    }

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
        dueDate: '',
      });
      setIsPayingDue(false);
      setSelectedDue(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-5 space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">New Transaction</h2>

      {/* Date */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Date *</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Amount */}
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
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
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
          {TRANSACTION_TYPES.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => {
                setFormData({ ...formData, type });
                setIsPayingDue(false); // Reset Due toggle when switching type
              }}
              className={`flex-1 py-2 px-3 text-sm rounded-md ${
                formData.type === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Account</option>
          {accounts?.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Due Fields */}
      {formData.type === 'Due' && (
        <>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate || ''}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Vendor *</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </>
      )}

    
      {/* Due Selection Component */}
      {isPayingDue && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Select Due *</label>
          <DueSelection
            onSelect={setSelectedDue}
            currentAmount={formData.amount}
          />
        </div>
      )}

      {/* Vendor Input (for non-Due) */}
      {formData.type !== 'Due' && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Vendor</label>
          <input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Vendor name"
          />
        </div>
      )}

      {/* Item Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Item</label>
        <input
          type="text"
          name="item"
          value={formData.item}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Item purchased"
        />
      </div>

      {/* Purpose */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Purpose *</label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Transaction purpose..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Save Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
