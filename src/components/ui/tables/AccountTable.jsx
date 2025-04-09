import React from 'react';

const AccountTable = ({ accounts }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Account Name</th>
            <th className="p-2 border">Type</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc._id}>
              <td className="p-2 border">{acc.name}</td>
              <td className="p-2 border capitalize">{acc.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;
