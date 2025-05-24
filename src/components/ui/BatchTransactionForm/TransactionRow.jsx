import React from 'react';

const TransactionRow = ({ data, onChange, accounts, vendors, workers, projects, items, index }) => {
  // Ensure all data fields have defined values
  const safeData = {
    date: data.date || '',
    type: data.type || 'Debit',
    amount: data.amount || '',
    account: data.account || '',
    project: data.project || '',
    associationType: data.associationType || '',
    vendor: data.vendor || '',
    worker: data.worker || '',
    item: data.item || '',
    purpose: data.purpose || ''
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...safeData };
    
    if (name === 'associationType') {
      updatedData = {
        ...safeData,
        associationType: value,
        vendor: value === 'Vendor' ? safeData.vendor : '',
        worker: value === 'Worker' ? safeData.worker : ''
      };
    } else {
      updatedData = { ...safeData, [name]: value };
    }
    
    onChange(index, updatedData);
  };

  const handleToggle = () => {
    const newType = safeData.type === 'Debit' ? 'Credit' : 'Debit';
    const updatedData = { ...safeData, type: newType };
    onChange(index, updatedData);
  };

  // Validate the current row
  const isValidRow = 
    safeData.date && 
    safeData.amount && 
    Number(safeData.amount) > 0 && 
    safeData.purpose;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-lg border ${
      isValidRow ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
    }`}>
      {/* Date Input */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Date *</label>
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
        <label className="block text-xs text-gray-500 mb-1">Type *</label>
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
        <label className="block text-xs text-gray-500 mb-1">Amount *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="number"
            name="amount"
            value={safeData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Account Select */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Account *</label>
        <select
          name="account"
          value={safeData.account}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
        >
          <option value="">Select Account</option>
          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      {/* Project Select */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Project</label>
        <select
          name="project"
          value={safeData.project}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Association Type Select */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Association</label>
        <select
          name="associationType"
          value={safeData.associationType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
        >
          <option value="">None</option>
          <option value="Vendor">Vendor</option>
          <option value="Worker">Worker</option>
        </select>
      </div>

      {/* Vendor Select - shown only when associationType is Vendor */}
      {safeData.associationType === 'Vendor' && (
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Vendor *</label>
          <select
            name="vendor"
            value={safeData.vendor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
          >
            <option value="">Select Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.companyName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Worker Select - shown only when associationType is Worker */}
      {safeData.associationType === 'Worker' && (
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Worker *</label>
          <select
            name="worker"
            value={safeData.worker}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
          >
            <option value="">Select Worker</option>
            {workers.map((worker) => (
              <option key={worker._id} value={worker._id}>
                {worker.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Item Select */}
      <div className="md:col-span-2">
        <label className="block text-xs text-gray-500 mb-1">Item</label>
        <select
          name="item"
          value={safeData.item}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
        >
          <option value="">Select Item</option>
          {items.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Purpose Input */}
      <div className="md:col-span-6">
        <label className="block text-xs text-gray-500 mb-1">Purpose *</label>
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