import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Wallet } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import AddExpenseModal from '../components/ui/modals/AddExpenseModal';
import ProjectCard from '../components/ui/cards/ProjectCard';
import ExpenseCard from '../components/ui/cards/ExpenseCard';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('projects');
  const [search, setSearch] = useState('');

  const handleAddExpenseClick = () => {
    setFilter('expenses');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleFilter = () => {
    setFilter((prev) => (prev === 'projects' ? 'expenses' : 'projects'));
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('api/auth/get-user');
      if (response.data) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
      navigate('/login');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get('/api/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get('/api/expenses');
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
    getUserInfo();
    fetchProjects();
    fetchExpenses();
  }, []);

  const filteredData = (() => {
    const lowerCaseSearch = search.toLowerCase();
    const sortByDate = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

    return filter === 'projects'
      ? projects.filter((project) => project.name?.toLowerCase().includes(lowerCaseSearch)).sort(sortByDate)
      : expenses.filter((expense) => expense.purpose?.toLowerCase().includes(lowerCaseSearch)).sort(sortByDate);
  })();

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className='w-full h-screen '>
          <div className='w-3xl h-20 px-5 rounded-full shadow-xl absolute bottom-30 bg-gray-600 z-20'>
              
          </div>
      </div>
    </>
  );
};

export default Home;
