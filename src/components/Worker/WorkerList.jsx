import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Modal from "../ui/modals/Modal";
import WorkerForm from './WorkerForm';
import { PlusCircle, Trash2, Loader } from 'lucide-react';
import ConfirmModal from '../ui/modals/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  
 

  const navigate = useNavigate();

  const fetchWorkers = async () => {
    try {
      const res = await axiosInstance.get('worker');
      console.log(res.data[0]._id)
      setWorkers(res.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchVendors = async () => {
    try {
      const res = await axiosInstance.get('vendor');
      console.log("vendors",res.data)
      setVendors(res.data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, workerId) => {
    try {
      await axiosInstance.delete(`worker/${workerId}`);
      fetchWorkers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting worker:', error);
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
    fetchWorkers();
    fetchVendors();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Workers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Add Worker
        </button>
      </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Wage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workers.map((worker) => (
                <tr 
                  key={worker._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/workers/${worker._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{worker.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{worker.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{worker.contactNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    ₹{worker.dailyWage.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      worker.status === 'Active' ? 'bg-green-100 text-green-800' :
                      worker.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkerToDelete(worker._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Worker">
        <WorkerForm onClose={() => setIsModalOpen(false)} refreshWorkers={fetchWorkers} />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        id={workerToDelete}
        title="Delete worker?"
        message="This action cannot be undone. Are you sure?"
      />
    </div>
  );
};

export default WorkerList;