import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { fetchExpenses } from '../api/expensesApi';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const response = await fetchExpenses();
        setExpenses(response.data.expenses);
      } catch (err) {
        console.error("Failed to fetch expenses");
      }
    };
    getExpenses();
  }, []);

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Expenses</h2>
      <ExpenseForm onAdd={handleAddExpense} />
      <ExpenseList expenses={expenses} />
    </div>
  );
};

export default Expenses;
