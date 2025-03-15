import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { getInitials } from '../../utils/helper';

const CreateProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCollaboratorList, setShowCollaboratorList] = useState(false);

  // Fetch available users (excluding current user)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/get-all-users');
        setUsers(response.data.users);
      } catch (err) {
        console.log('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/projects', {
       name :  projectName,
        description,
        estimatedBudget: budget,
        endDate,
        collaborators,
      });
      if (response.data) {
        navigate('/'); // Redirect to home on success
      }
    } catch (err) {
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollaborator = (user) => {
    if (!collaborators.some((collab) => collab._id === user._id)) {
      setCollaborators((prev) => [...prev, user]);
    }
  };

  const handleRemoveCollaborator = (id) => {
    setCollaborators((prev) => prev.filter((user) => user._id !== id));
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 p-10">
      <div className="w-full max-w-lg bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Create Project</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="Project Name"
            className="input-box"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="input-box"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
          <input
            type="number"
            placeholder="Budget"
            className="input-box"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="End Date"
            className="input-box"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* Collaborators Section */}
          <div className="mb-4 py-2">

           {/* Selected Collaborators */}
{collaborators.length > 0 && (
  <>
    <h1 className="text-lg mb-2">
      {collaborators.length === 1 ? 'Collaborator' : 'Collaborators'}
    </h1>
    <div className="flex flex-wrap gap-2 mb-2">
      {collaborators.map((collab) => (
        <div
          key={collab._id}
          className="uppercase bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
        >
          <div className='p-1 px-2 rounded-full bg-gray-500 text-black'>{getInitials(collab.name)}</div>
          {collab.name}
          <button
            className="text-red-500 font-bold"
            onClick={() => handleRemoveCollaborator(collab._id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  </>
)}


            {/* Expandable User List */}
            {showCollaboratorList && (
              <div className="overflow-y-auto max-h-60 border rounded-md bg-gray-50 p-2">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="cursor-pointer p-2 bg-gray-100 rounded mb-1 hover:bg-gray-200"
                      onClick={() => handleAddCollaborator(user)}
                    >
                      {user.fullName} - {user.email}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No users available.</p>
                )}
              </div>
            )}

            <button
              type="button"
              className="btn-primary w-full my-2"
              onClick={() => setShowCollaboratorList(!showCollaboratorList)}
            >
              {showCollaboratorList ? 'Hide Collaborators' : 'Add Collaborators'}
            </button>
          </div>

          <button
            type="submit"
            className={`btn-primary w-full ${loading ? 'opacity-70' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
