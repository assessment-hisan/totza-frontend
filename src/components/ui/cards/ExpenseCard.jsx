import React from 'react';

const ExpenseCard = ({ expense }) => {
  return (
    <div className="min-w-sm max-w-2xl bg-white p-4 rounded shadow-md hover:shadow-lg transition cursor-pointer">
      <span className="text-white text-sm font-semibold bg-green-600 px-2 py-1 rounded mb-2 inline-block">
        Expense
      </span>
      <h3 className="text-lg font-semibold text-gray-800">{expense.purpose}</h3>
      <p className="text-gray-600">Amount: ₹{expense.amount}</p>
      <p className="text-gray-500 text-sm">
        Date: {expense.date ? new Date(expense.date).toLocaleDateString() : 'Unknown date'}
      </p>
    </div>
  );
};

export default ExpenseCard;
