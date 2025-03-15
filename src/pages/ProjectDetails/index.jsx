import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [expense, setExpense] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/api/projects/${id}`);
        setProject(response.data.project);
        console.log(response.data.project);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProject();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/api/project-expenses/${id}/`, {
        purpose: expense,
        amount: parseFloat(amount),
      });
      setSuccess('Expense added successfully!');
      setExpense('');
      setAmount('');
      setError('');
      const response = await axiosInstance.get(`/api/projects/${id}`);
      setProject(response.data.project);
    } catch (err) {
      setError('Failed to add expense.');
      console.error('Error adding expense:', err);
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-4xl font-bold mb-2">{project.name}</h2>
        <p className="text-gray-600 mb-2">{project.description}</p>
        <p className="text-lg font-semibold">Estimated Budget: ₹{project.estimatedBudget.toLocaleString()}</p>
        <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
        <p className="mt-4">Owner: {project.owner.name} ({project.owner.email})</p>
        <p>Created At: {new Date(project.createdAt).toLocaleString()}</p>
        <p>Collaborators: {project.collaborators.map(collab => `${collab.name} (${collab.email})`).join(', ') || 'None'}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Expenses</h3>
        {project.expenses.length > 0 ? (
          <ul>
            {project.expenses.map((exp, index) => (
              <li key={index} className="p-2 border-b">
                <p><span className="font-semibold">{exp.purpose}</span> - ₹{exp.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Added by: {exp.addedBy.name} ({exp.addedBy.email})</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses recorded.</p>
        )}
      </div>

      <form onSubmit={handleAddExpense} className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Add Expense</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <div className="mb-2">
          <label className="block font-medium">Expense Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            placeholder="Enter expense name"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Amount</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            min="0"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ProjectDetails;
