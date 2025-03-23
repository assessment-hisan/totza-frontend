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
      <div className="p-4 bg-gray-100 min-h-screen pb-36">
        <div className="flex justify-between items-center mb-4">
          <button onClick={toggleFilter} className="flex items-center gap-2 p-2 bg-white rounded shadow-md transition-transform hover:scale-105">
            {filter === 'projects' ? (
              <Briefcase className="text-blue-500" />
            ) : (
              <Wallet className="text-green-500" />
            )}
            <span className="font-semibold capitalize">{filter}</span>
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-3">
          {filteredData.map((item) =>
            filter === 'expenses' ? (
              <ExpenseCard key={item.id} expense={item} />
            ) : (
              <ProjectCard key={item._id} project={item} />
            )
          )}
        </div>
      </div>

      <div className="fixed bottom-10 left-0 right-0 p-4 flex justify-center gap-20">
        <button className="btn-primary" onClick={() => navigate('/create-project')}>
          Create Project
        </button>
        <button className="btn-primary" onClick={handleAddExpenseClick}>
          Add Expense
        </button>
      </div>

      {showModal && <AddExpenseModal onClose={handleCloseModal} />}
    </>
  );
};

export default Home;
