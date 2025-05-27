import React, { useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

const PayDueForm = ({ dueId, accounts, maxAmount, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    discount: '0',
    account: '',
    paymentDate: new Date().toISOString().split('T')[0],
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Convert to numbers and handle empty values
    const amount = parseFloat(formData.amount) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const totalPayment = amount + discount;

    // Validations
    if (amount <= 0) {
      setError('Payment amount must be greater than 0');
      setLoading(false);
      return;
    }

    if (discount < 0) {
      setError('Discount cannot be negative');
      setLoading(false);
      return;
    }

    if (totalPayment > maxAmount) {
      setError(`Total payment (amount + discount) cannot exceed ₹${maxAmount.toFixed(2)}`);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`/due/${dueId}/payments`, {
        amount: amount,
        discount: discount,
        account: formData.account,
        paymentDate: formData.paymentDate,
        purpose: formData.purpose,
        type: 'Debit'
      });

      if (onSuccess) onSuccess(response.data);
      onCancel();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Record Payment</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (max: ₹{maxAmount?.toFixed(2)})
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              max={maxAmount}
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount
            </label>
            {/* <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              max={Math.max(0, maxAmount - (parseFloat(formData.amount) || 0)}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter any discount if applicable"
            /> */}
            <input 
             type="number"
             name="discount"
             value={formData.discount}
             onChange={handleChange}
             max={Math.max(0, maxAmount - (parseFloat(formData.amount) || 0))}
             min="0"
             step="0.01"
             className="w-full px-3 py-2 border border-gray-300 rounded-md"
             placeholder="Enter any discount if applicable"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              
            >
              <option value="">Select Account</option>
              {accounts?.map(account => (
                <option key={account._id} value={account._id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Processing...' : 'Record Payment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PayDueForm