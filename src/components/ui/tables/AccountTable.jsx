import React from 'react';
import { Trash2 } from 'lucide-react';

const AccountTable = ({ accounts, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-left">Account Name</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc._id}>
              <td className="p-2 border">{acc.name}</td>
              <td className="p-2 border text-center">
                <button 
                  onClick={() => onDelete(acc._id)} 
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none"
                  title="Delete account"
                >
                  {!acc.linkedUser && <Trash2 size={18} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;