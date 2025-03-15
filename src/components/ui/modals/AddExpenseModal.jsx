import { useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

const AddExpenseModal = ({ onClose, onExpenseAdded }) => {
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddExpense = async () => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/expenses/', { purpose, amount });
      if (response.data) {
        onExpenseAdded(response.data.expense); // Notify parent component
        onClose();
      }

    } catch (err) {
      
      setError('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500/30 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h3 className="text-xl mb-4">Add Expense</h3>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleAddExpense}>
          <input
            type="text"
            placeholder="Purpose"
            className="input-box"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            className="input-box"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`btn-primary w-full ${loading ? 'opacity-70' : ''}`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Expense'}
          </button>
          <button
            type="button"
            className="btn-secondary w-full mt-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
