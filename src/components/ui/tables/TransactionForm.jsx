import React, { useState } from 'react';



const TransactionForm = ({ accounts,  onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'debit',
    amount: '',
    account: '',
    vendor: '',
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

    await onSubmit(data);
    setLoading(false);
    setFormData({
      type: 'Debit',
      amount: '',
      account: '',
      vendor: '',
      purpose: '',
      files: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-5 space-y-6 mb-10 bg-white p-4 sm:py-6 rounded-xl shadow-lg max-w-md w-full mx-auto"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">New Transaction</h2>

      {/* Amount Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Amount <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Transaction Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Transaction Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {['Debit', 'Credit'].map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setFormData({ ...formData, type })}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${formData.type === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-pressed={formData.type === type}
              aria-label={`Select ${type} transaction type`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Account Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Account <span className="text-red-500">*</span>
        </label>
        <select
          name="account"
          value={formData.account}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vendor Selector */}
      {/* <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Vendor <span className="text-red-500">*</span>
        </label>
        <select
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Vendor</option>
          {vendors.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* vendor */}
      <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Vendor 
  </label>
  <input
    type="text"
    name="vendor"
    value={formData.vendor}
    onChange={handleChange}
    
    placeholder="Enter vendor name"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
</div>

   {/* vendor */}
   <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Item 
  </label>
  <input
    type="text"
    name="item"
    value={formData.item}
    onChange={handleChange}
    
    placeholder="Enter vendor name"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
</div>

      {/* Purpose Textarea */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Purpose <span className="text-red-500">*</span>
        </label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Describe the purpose of this transaction..."
        />
      </div>

      {/* File Upload
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Attachments
        </label>
        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors text-center">
          <input
            type="file"
            name="files"
            multiple
            onChange={handleChange}
            className="hidden"
            aria-label="Upload files"
          />
          <svg
            className="w-8 h-8 text-gray-400 mb-2 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm text-gray-600">
            {formData.files.length > 0
              ? `${formData.files.length} file${formData.files.length > 1 ? 's' : ''} selected`
              : 'Tap to upload or drag and drop'}
          </span>
        </label>
      </div> */}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </div>
        ) : (
          'Save Transaction'
        )}
      </button>
    </form>
  );
};

export default TransactionForm;
