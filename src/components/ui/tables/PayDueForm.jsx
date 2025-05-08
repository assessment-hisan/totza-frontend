// components/PayDueForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PayDueForm = ({ accounts }) => {
  const { dueId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [due, setDue] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    account: '',
    purpose: '',
    files: []
  });
  const [maxPayment, setMaxPayment] = useState(0);

  useEffect(() => {
    const fetchDue = async () => {
      try {
        const res = await axios.get(`/api/transactions/dues/${dueId}`);
        setDue(res.data);
        
        // Calculate remaining amount
        const paymentsRes = await axios.get(`/api/transactions/payments?dueId=${dueId}`);
        const paidAmount = paymentsRes;
        const remaining = res.data.amount - paidAmount;
        setMaxPayment(remaining);
        
        // Pre-fill amount with remaining if < 5000, else 5000
        const suggestedAmount = remaining < 5000 ? remaining : 5000;
        setFormData(prev => ({
          ...prev,
          amount: suggestedAmount,
          purpose: `Payment for Due ${res.data._id}: ${res.data.purpose}`
        }));
      } finally {
        setLoading(false);
      }
    };
    fetchDue();
  }, [dueId]);

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
    
    try {
      // Create the payment transaction
      await axios.post('/api/transactions', {
        type: 'Debit',
        date: formData.date,
        amount: parseFloat(formData.amount),
        account: formData.account,
        purpose: formData.purpose,
        files: formData.files,
        linkedDue: dueId
      });
      
      navigate(`/dues/${dueId}`, { state: { paymentSuccess: true } });
    } catch (err) {
      alert(`Payment failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading due information...</div>;
  if (!due) return <div className="p-8 text-center">Due not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Pay Due</h2>
        
        {/* Due Summary */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-2">{due.vendor}</h3>
          <p className="text-sm text-gray-600 mb-1">Due Date: {new Date(due.dueDate).toLocaleDateString()}</p>
          <p className="text-sm mb-2">Purpose: {due.purpose}</p>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Original Amount:</p>
              <p className="font-bold">₹{due.amount}</p>
            </div>
            <div>
              <p className="text-sm">Maximum Payment:</p>
              <p className="font-bold text-blue-600">₹{maxPayment}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0.01"
                max={maxPayment}
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border rounded"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum: ₹{maxPayment}
            </p>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium mb-1">From Account *</label>
            <select
              name="account"
              value={formData.account}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Account</option>
              {accounts?.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Files */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Receipt/Document
            </label>
            <input
              type="file"
              name="files"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              multiple
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing Payment...' : 'Record Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PayDueForm;