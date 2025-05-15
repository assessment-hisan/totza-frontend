import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Loader, AlertCircle } from 'lucide-react';

const WorkerForm = ({ onClose, refreshWorkers }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    address: '',
    role: 'Laborer',
    dailyWage: '',
    joiningDate: '',
    status: 'Active',
    assignedProject: ''
  });

  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get('project');
        setProjects(res.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.dailyWage || Number(formData.dailyWage) <= 0) {
      newErrors.dailyWage = 'Daily wage must be positive';
    }
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';

    setErrors(newErrors);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      await axiosInstance.post('worker', formData);
      refreshWorkers();
      onClose();
    } catch (error) {
      console.error('Error creating worker:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.name}
            </p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number *
          </label>
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.contactNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.contactNumber && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.contactNumber}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <textarea
          id="address"
          name="address"
          rows={2}
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" /> {errors.address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Laborer">Laborer</option>
            <option value="Mason">Mason</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Foreman">Foreman</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Daily Wage */}
        <div>
          <label htmlFor="dailyWage" className="block text-sm font-medium text-gray-700 mb-1">
            Daily Wage (₹) *
          </label>
          <input
            type="number"
            id="dailyWage"
            name="dailyWage"
            min="1"
            step="1"
            value={formData.dailyWage}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.dailyWage ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.dailyWage && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.dailyWage}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Joining Date */}
        <div>
          <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 mb-1">
            Joining Date *
          </label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.joiningDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.joiningDate && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {errors.joiningDate}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Assigned Project */}
      <div>
        <label htmlFor="assignedProject" className="block text-sm font-medium text-gray-700 mb-1">
          Assigned Project (Optional)
        </label>
        <select
          id="assignedProject"
          name="assignedProject"
          value={formData.assignedProject}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>{project.title}</option>
          ))}
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
            loading || Object.keys(errors).length > 0
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          Add Worker
        </button>
      </div>
    </form>
  );
};

export default WorkerForm;