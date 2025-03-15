import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchExpenses = async () => axios.get(`${API_URL}/expenses`);
export const addExpense = async (data) => axios.post(`http://localhost:5000/api/expenses`, data);
export const deleteExpense = async (id) => axios.delete(`${API_URL}/expenses/${id}`);
