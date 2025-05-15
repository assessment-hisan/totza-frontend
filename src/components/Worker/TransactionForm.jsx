import React, { useState } from 'react';
import { Calendar, PlusCircle, Upload, X } from 'lucide-react';

const TransactionForm = ({ 
  entityId, 
  entityType, // 'worker', 'vendor', or 'project'
  accounts,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    type: 'Debit',
    amount: '',
    discount: '',
    dueDate: '',
    account: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    items: '',
    files: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
//   const [filePreviews, setFilePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFilePreviews(files.map(file => ({
//       name: file.name,
//       url: URL.createObjectURL(file)
//     })));
//     setFormData(prev => ({ ...prev, files }));
//   };

//   const removeFile = (index) => {
//     const newFiles = [...formData.files];
//     newFiles.splice(index, 1);
//     setFormData(prev => ({ ...prev, files: newFiles }));
    
//     const newPreviews = [...filePreviews];
//     URL.revokeObjectURL(newPreviews[index].url);
//     newPreviews.splice(index, 1);
//     setFilePreviews(newPreviews);
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      
      // Add core fields
      formPayload.append('type', formData.type);
      formPayload.append('amount', formData.amount);
      formPayload.append('date', formData.date);
      formPayload.append('purpose', formData.purpose);
      formPayload.append('items', formData.items);
      
      // Add entity reference
      formPayload.append(entityType, entityId);
      
      // Add conditional fields
      if (formData.discount) formPayload.append('discount', formData.discount);
      if (formData.account) formPayload.append('account', formData.account);
      if (formData.type === 'Due' && formData.dueDate) {
        formPayload.append('dueDate', formData.dueDate);
      }
      
      // Add files
      formData.files.forEach(file => {
        formPayload.append('files', file);
      });

      await onSubmit(formPayload);
      onCancel();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Add Transaction</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              formData.type === 'Debit' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'Debit' }))}
          >
            Debit
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              formData.type === 'Due' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'Due' }))}
          >
            Due
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (₹)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account
            </label>
            <select
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Account</option>
              {accounts?.map(account => (
                <option key={account._id} value={account._id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Due Date (conditionally shown) */}
          {formData.type === 'Due' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={formData.date}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required={formData.type === 'Due'}
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose
          </label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Items */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Items (comma separated)
          </label>
          <input
            type="text"
            name="items"
            value={formData.items}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

       

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Add Transaction
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;