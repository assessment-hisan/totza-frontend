// components/DueSelection.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const DueSelection = ({ onSelect, currentAmount }) => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const fetchDues = async () => {
      try {
        const res = await axios.get('/api/transactions/dues');
        setDues(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchDues();
  }, []);

  useEffect(() => {
    if (selected) {
      onSelect(selected);
      // Calculate remaining amount logic here
    }
  }, [selected, currentAmount]);

  return (
    <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
      <h4 className="font-medium text-gray-700">Select Due to Pay</h4>
      
      {loading ? (
        <p>Loading dues...</p>
      ) : (
        <select
          value={selected?._id || ''}
          onChange={(e) => setSelected(dues.find(d => d._id === e.target.value))}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Due</option>
          {dues.map(due => (
            <option key={due._id} value={due._id}>
              {due.vendor} - ₹{due.amount} (Due: {new Date(due.dueDate).toLocaleDateString()})
            </option>
          ))}
        </select>
      )}

      {selected && (
        <div className="mt-2 text-sm">
          <p>Original Amount: ₹{selected.amount}</p>
          <p>Remaining: ₹{remaining}</p>
          <p>Maximum Payment: ₹{Math.min(remaining, currentAmount || Infinity)}</p>
        </div>
      )}
    </div>
  );
};

export default DueSelection