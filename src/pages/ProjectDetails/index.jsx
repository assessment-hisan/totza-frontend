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
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true); // Show loading
        const response = await axiosInstance.get(`/api/projects/${id}`);
        setProject(response.data.project);
        console.log(response.data.project);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false); // Hide loading
      }
    };
    fetchProject();
  }, [id]);

  const handleAddExpense = async (e, isCredit) => {
    e.preventDefault();
    try {
      setLoading(true); // Show loading
      await axiosInstance.post(`/api/project-expenses/${id}/`, {
        purpose: expense,
        amount: parseFloat(amount),
        credit: isCredit,
      });
      setSuccess('Transaction added successfully!');
      setExpense('');
      setAmount('');
      setError('');
      const response = await axiosInstance.get(`/api/projects/${id}`);
      setProject(response.data.project);
    } catch (err) {
      setError('Failed to add transaction.');
      console.error('Error adding transaction:', err);
    } finally {
      setLoading(false); // Hide loading
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      setLoading(true); // Show loading
      await axiosInstance.delete(`/api/project-expenses/${id}/${transactionId}`);
      setSuccess('Transaction deleted successfully!');
      const response = await axiosInstance.get(`/api/projects/${id}`);
      setProject(response.data.project);
    } catch (err) {
      setError('Failed to delete transaction.');
      console.error('Error deleting transaction:', err);
    } finally {
      setLoading(false); // Hide loading
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen relative">
      {loading && (
        <div className="fixed inset-0 bg-black/10 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-4xl font-bold mb-2">{project.name}</h2>
        <p className="text-gray-600 mb-2">{project.description}</p>
        <p className="text-lg font-semibold">Estimated Budget: ₹{project.estimatedBudget.toLocaleString()}</p>
        <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
        <p className="mt-4">Owner: {project.owner.name} ({project.owner.email})</p>
        <p>Created At: {new Date(project.createdAt).toLocaleString()}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Transactions</h3>
        {project.expenses.length > 0 ? (
          <ul>
            {project.expenses.map((txn, index) => (
              <li key={index} className="p-2 border-b flex justify-between items-center">
                <p>
                  <span className="font-semibold">{txn.purpose}</span> - ₹{txn.amount.toLocaleString()} 
                  ({txn.credit ? 'Credit' : 'Debit'})
                  <span className="text-gray-500 text-sm ml-2">
                    by {txn.addedBy.name} on {new Date(txn.time).toLocaleString()}
                  </span>
                </p>
                <button
                  onClick={() => handleDeleteTransaction(txn._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions recorded.</p>
        )}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Add Transaction</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <div className="mb-2">
          <label className="block font-medium">Purpose</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            placeholder="Enter purpose"
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
        <div className="flex gap-4">
          <button
            onClick={(e) => handleAddExpense(e, true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Credit
          </button>
          <button
            onClick={(e) => handleAddExpense(e, false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Debit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectDetails;
