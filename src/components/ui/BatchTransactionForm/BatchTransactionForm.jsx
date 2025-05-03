import React, { useState } from 'react';
import TransactionRow from "./TransactionRow";
import { TrashIcon, PlusIcon, CheckIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react'; // Replacing SplineIcon with Loader2

const defaultRow = () => ({
  date: new Date().toISOString().split('T')[0],
  type: 'Debit',
  amount: '',
  account: '',
  vendor: '',
  item: '',
  purpose: ''
});

const BatchTransactionForm = ({ accounts, onSubmit }) => {
  const [rows, setRows] = useState(Array(5).fill().map(defaultRow));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Modified validation function to be less strict
  const validRows = (rows) => {
    return rows.filter(row => {
      // Consider a row valid if it has date, amount, and either account or purpose
      return row.date && 
             row.amount && 
             Number(row.amount) > 0 && 
             (row.account || row.purpose);
    });
  };

  const handleRowChange = (index, newData) => {
    const updated = [...rows];
    updated[index] = newData;
    setRows(updated);
  };

  const addRow = () => setRows((prev) => [...prev, defaultRow()]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Get validated rows (filter out incomplete ones)
    const filteredRows = validRows(rows);
   
    if (filteredRows.length === 0) {
      // Handle case where no valid rows exist
      console.log("Please add valid transactions before submitting");
      setLoading(false);
      return;
    }
  
    try {
      // Debug log to see what's being submitted
      console.log("Submitting transaction data:", filteredRows);
      
      // Call the onSubmit prop with the filtered rows
      await onSubmit(filteredRows);
      
      // Reset form after successful submission
      setRows(Array(5).fill().map(defaultRow));
      setErrors({});
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Add Multiple Transactions</h2>

      <div className="space-y-4">
        {rows.map((row, index) => (
          <TransactionRow
            key={index}
            index={index}
            data={row}
            onChange={handleRowChange}
            accounts={accounts}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <button 
          type="button" 
          onClick={addRow}
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors flex items-center gap-1"
        >
          <PlusIcon className="w-4 h-4" />
          Add Row
        </button>
      </div>

      <div className="mt-2 border-t pt-4">
        <div className="text-right font-medium mb-2">
          Valid Transactions: {validRows(rows).length}/{rows.length}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4" />
              Submit All
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => { setRows(Array(5).fill().map(defaultRow)); setErrors({}); }}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex-1 flex items-center justify-center gap-2"
        >
          <TrashIcon className="w-4 h-4" />
          Clear All
        </button>
      </div>
    </form>
  );
};

export default BatchTransactionForm;