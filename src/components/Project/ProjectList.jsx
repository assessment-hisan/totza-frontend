import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Modal from "../ui/modals/Modal"
import ProjectForm from './ProjectForm';
import { getStatusColor } from '../../utils/helper';
import { PlusCircle, Trash2, Loader } from 'lucide-react';
import ConfirmModal from '../ui/modals/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [loading, setLoading] = useState(true);


  const { projectId } = useParams();
  const navigate = useNavigate();

  // Remove this function - it uses 'project' which isn't defined here
  // const handleClick = () => {
  //   navigate(`/project/${project._id}`);
  // };

  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get('project')
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false)
    }
  };

  const handleDelete = async (e, projectId) => {
    // Stop click event from bubbling up to parent div
    e.stopPropagation();

    try {
      await axiosInstance.delete(`project/${projectId}`);
      fetchProjects(); // Refresh list
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800"> Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Create Project
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5 h-48 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr
                  key={project._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/project/${project._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(project.startDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(project.endDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-medium">
                    {project.estimatedBudget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectToDelete(project._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <ProjectForm onClose={() => setIsModalOpen(false)} refreshProjects={fetchProjects} />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        id={projectToDelete}
        title="Delete Project?"
        message="This action cannot be undone. Are you sure?"
      />
    </div>
  );

};

export default ProjectsList;