import React, { useState, useMemo } from 'react';
import { Check, AlertCircle, Calendar, DollarSign, User, Package, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const TRANSACTION_TYPES = [
  { id: 'Debit', icon: <ChevronDown className="w-4 h-4" />, color: 'text-red-500' },
  { id: 'Credit', icon: <ChevronUp className="w-4 h-4" />, color: 'text-green-500' },
  { id: 'Due', icon: <Calendar className="w-4 h-4" />, color: 'text-amber-500' }
];

const FieldWrapper = ({ label, children, required, error }) => (
  <div className="space-y-1">
    <label className="flex items-center text-xs font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center mt-1">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </p>
    )}
  </div>
);

const InputField = ({ icon, name, value, onChange, error, ...rest }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 ${icon ? 'pl-8' : 'pl-3'} border rounded-md text-sm transition-all duration-200 ${
        error 
          ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      }`}
      {...rest}
    />
  </div>
);

const TransactionRow = ({ data, onChange, accounts, index, onRemove }) => {
  const defaultData = {
    date: '', 
    type: 'Debit', 
    amount: '', 
    account: '',
    vendor: '', 
    item: '', 
    purpose: '', 
    dueDate: '', 
    files: []
  };

  const safeData = useMemo(() => ({ ...defaultData, ...data }), [data]);
  const [isPayingDue, setIsPayingDue] = useState(false);
  const [expanded, setExpanded] = useState(true);
  
  // Field validation
  const errors = {
    date: !safeData.date ? 'Required' : '',
    amount: !safeData.amount ? 'Required' : safeData.amount <= 0 ? 'Must be greater than 0' : '',
    account: !safeData.account && !safeData.purpose ? 'Either Account or Purpose required' : '',
    purpose: !safeData.purpose && !safeData.account ? 'Either Purpose or Account required' : '',
    dueDate: safeData.type === 'Due' && !safeData.dueDate ? 'Required for due' : '',
    vendor: safeData.type === 'Due' && !safeData.vendor ? 'Required for due' : ''
  };
  
  const hasErrors = Object.values(errors).some(error => error);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...safeData, [name]: value });
  };

  const handleTypeChange = (type) => {
    const updated = {
      ...safeData,
      type,
      vendor: type === 'Due' ? '' : safeData.vendor,
      dueDate: type === 'Due' ? '' : safeData.dueDate
    };
    setIsPayingDue(type !== 'Due' ? false : isPayingDue);
    onChange(index, updated);
  };

  const handleDueSelect = (due) => {
    setIsPayingDue(false);
    onChange(index, {
      ...safeData,
      amount: due.remainingAmount,
      vendor: due.vendor,
      purpose: `Payment for due from ${due.vendor}`
    });
  };
  
  // Mock DueSelection component for demonstration
  const DueSelection = ({ onSelect, currentAmount }) => (
    <button 
      onClick={() => onSelect({ remainingAmount: 1500, vendor: 'Sample Vendor' })}
      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-left hover:bg-gray-50"
    >
      Select a due...
    </button>
  );

  return (
    <div className={`rounded-lg border shadow-sm transition-all duration-200 ${
      hasErrors ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
            hasErrors ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
          }`}>
            {hasErrors ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </span>
          <h3 className="font-medium text-gray-700">
            {safeData.type} Transaction
            {safeData.amount ? ` • ₹${safeData.amount}` : ''}
            {safeData.vendor ? ` • ${safeData.vendor}` : ''}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md hover:bg-gray-200 text-gray-500"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1 rounded-md hover:bg-red-100 text-red-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4">
          {/* Transaction Type Selection */}
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2">
              {TRANSACTION_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-all duration-200 ${
                    safeData.type === type.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className={safeData.type === type.id ? 'text-white' : type.color}>
                    {type.icon}
                  </span>
                  <span>{type.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Fields */}
            <div className="md:col-span-3">
              <FieldWrapper label="Date" required error={errors.date}>
                <InputField
                  type="date"
                  name="date"
                  icon={<Calendar className="w-4 h-4" />}
                  value={safeData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  error={errors.date}
                />
              </FieldWrapper>
            </div>

            <div className="md:col-span-3">
              <FieldWrapper label="Amount" required error={errors.amount}>
                <InputField
                  type="number"
                  name="amount"
                  icon={<DollarSign className="w-4 h-4" />}
                  value={safeData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  error={errors.amount}
                />
              </FieldWrapper>
            </div>

            <div className="md:col-span-3">
              <FieldWrapper 
                label="Account" 
                required={!safeData.purpose}
                error={errors.account}
              >
                <div className={`relative ${errors.account ? 'border border-red-300 rounded-md' : ''}`}>
                  <select
                    name="account"
                    value={safeData.account}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-3 py-2 border rounded-md text-sm appearance-none bg-white ${
                      errors.account 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Account</option>
                    {accounts && accounts.map(acc => (
                      <option key={acc._id} value={acc._id}>{acc.name}</option>
                    ))}
                  </select>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
              </FieldWrapper>
            </div>

            <div className="md:col-span-3">
              <FieldWrapper 
                label="Vendor" 
                required={safeData.type === 'Due'}
                error={errors.vendor}
              >
                <InputField
                  type="text"
                  name="vendor"
                  icon={<User className="w-4 h-4" />}
                  value={safeData.vendor}
                  onChange={handleChange}
                  placeholder="Vendor name"
                  error={errors.vendor}
                />
              </FieldWrapper>
            </div>

            {/* Due-specific fields */}
            {safeData.type === 'Due' && (
              <div className="md:col-span-3">
                <FieldWrapper label="Due Date" required error={errors.dueDate}>
                  <InputField
                    type="date"
                    name="dueDate"
                    icon={<Calendar className="w-4 h-4" />}
                    value={safeData.dueDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    error={errors.dueDate}
                  />
                </FieldWrapper>
              </div>
            )}

            {/* Due payment selection */}
            {safeData.type !== 'Due' && (
              <div className="md:col-span-3">
                <FieldWrapper label="Pay Existing Due">
                  <button
                    type="button"
                    onClick={() => setIsPayingDue(!isPayingDue)}
                    className={`w-full px-3 py-2 text-sm rounded-md flex items-center justify-center ${
                      isPayingDue 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {isPayingDue ? 'Cancel' : 'Select Due to Pay'}
                  </button>
                </FieldWrapper>
              </div>
            )}

            {isPayingDue && (
              <div className="md:col-span-3">
                <FieldWrapper label="Select Due">
                  <DueSelection onSelect={handleDueSelect} currentAmount={safeData.amount} />
                </FieldWrapper>
              </div>
            )}

            <div className="md:col-span-3">
              <FieldWrapper label="Item">
                <InputField
                  type="text"
                  name="item"
                  icon={<Package className="w-4 h-4" />}
                  value={safeData.item}
                  onChange={handleChange}
                  placeholder="Item description"
                />
              </FieldWrapper>
            </div>

            {/* Purpose field - full width at bottom */}
            <div className="md:col-span-12">
              <FieldWrapper 
                label="Purpose" 
                required={!safeData.account}
                error={errors.purpose}
              >
                <textarea
                  name="purpose"
                  value={safeData.purpose}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Describe the purpose of this transaction"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    errors.purpose 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                />
              </FieldWrapper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage for display


export default TransactionRow