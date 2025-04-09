import React from 'react';

const TransactionTable = ({ transactions = [] }) => {
  if (!transactions.length) {
    return <p className="text-center text-gray-500">No transactions available.</p>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full text-sm text-left text-gray-800 bg-white">
        <thead className="bg-gray-100 border-b font-semibold text-gray-700">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Account</th>
            <th className="px-4 py-3">Vendor</th>
            <th className="px-4 py-3">Purpose</th>
            <th className="px-4 py-3">Added By</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{new Date(txn.createdAt).toLocaleDateString()}</td>
              <td className={`px-4 py-2 font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {txn.type}
              </td>
              <td className="px-4 py-2">₹{txn.amount.toLocaleString()}</td>
              <td className="px-4 py-2">{txn.account?.name || 'N/A'}</td>
              <td className="px-4 py-2">{txn.vendor?.name || 'N/A'}</td>
              <td className="px-4 py-2">{txn.purpose}</td>
              <td className="px-4 py-2">{txn.addedBy?.name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
