import React, { useState } from 'react';
import DueSelection from "../../Due/DueSelection";

const TRANSACTION_TYPES = ['Debit', 'Credit', 'Due'];

const TransactionForm = ({ vendors, accounts, projects, workers, items, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: '',
    type: 'Debit',
    amount: '',
    account: '',
    project: '',
    associationType: '', // '' means None, 'Vendor', or 'Worker'
    vendor: '',
    worker: '',
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
    data.append('date', formData.date);
    data.append('type', formData.type);
    data.append('amount', formData.amount);
    data.append('account', formData.account);
    data.append('purpose', formData.purpose);
    formData.files.forEach((file) => data.append('files', file));

    if (formData.type === 'Due') {
      data.append('dueDate', formData.dueDate);
    }

    if (formData.project) {
      data.append('project', formData.project);
    }

    if (formData.associationType === 'Vendor' && formData.vendor) {
      data.append('vendor', formData.vendor);
    } else if (formData.associationType === 'Worker' && formData.worker) {
      data.append('workers', formData.worker); // Matches CompanyTransaction schema
    }

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
        project: '',
        associationType: '',
        vendor: '',
        worker: '',
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
    <div className="m-5 space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
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
                setIsPayingDue(false);
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
          required
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

      {/* Project Select */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Project</label>
        <select
          name="project"
          value={formData.project}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Project (Optional)</option>
          {projects?.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Association Type Select */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Association</label>
        <select
          name="associationType"
          value={formData.associationType}
          onChange={(e) => {
            const newType = e.target.value;
            setFormData({
              ...formData,
              associationType: newType,
              vendor: newType === 'Vendor' ? formData.vendor : '',
              worker: newType === 'Worker' ? formData.worker : '',
            });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">None</option>
          <option value="Vendor">Vendor</option>
          <option value="Worker">Worker</option>
        </select>
      </div>

      {/* Vendor Select */}
      {formData.associationType === 'Vendor' && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Vendor *</label>
          <select
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Vendor</option>
            {vendors?.map((vendor) => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.companyName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Worker Select */}
      {formData.associationType === 'Worker' && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Worker *</label>
          <select
            name="worker"
            value={formData.worker}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Worker</option>
            {workers?.map((worker) => (
              <option key={worker._id} value={worker._id}>
                {worker.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Item Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Item </label>
        <select
          name="account"
          value={formData.item}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Item</option>
          {items?.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name}
            </option>
          ))}
        </select>
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

      {/* Due Fields */}
      {formData.type === 'Due' && (
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

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
        onClick={handleSubmit}
      >
        {loading ? 'Processing...' : 'Save Transaction'}
      </button>
    </div>
  );
};

export default TransactionForm;