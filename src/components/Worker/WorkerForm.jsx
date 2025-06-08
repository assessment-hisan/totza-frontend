import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Loader, AlertCircle } from 'lucide-react';

const WorkerForm = ({ initialData, onClose, refreshWorkers, isEditing = false, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    address: '',
    role: 'Laborer',
    dailyWage: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data with initial data if provided (for editing)
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.name || '',
        contactNumber: initialData.contactNumber || '',
        address: initialData.address || '',
        role: initialData.role || 'Laborer',
        dailyWage: initialData.dailyWage || '',
      });
    }
  }, [initialData, isEditing]);

  // Validation useEffect
  useEffect(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.dailyWage || Number(formData.dailyWage) <= 0) {
      newErrors.dailyWage = 'Daily wage must be positive';
    }

    setErrors(newErrors);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      
      if (isEditing) {
        // FIXED: Check for proper ID and use onSubmit if provided
        if (!initialData?._id) {
          throw new Error('Worker ID is missing');
        }

        if (onSubmit) {
          // Use passed onSubmit function for editing
          await onSubmit(formData);
        } else {
          // FIXED: Use _id instead of id
          await axiosInstance.put(`worker/${initialData._id}`, formData);
          refreshWorkers();
          onClose();
        }
      } else {
        // Create new worker
        await axiosInstance.post('worker', formData);
        refreshWorkers();
        onClose();
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} worker:`, error);
      // Set error for user feedback
      setErrors({ submit: error.message || `Failed to ${isEditing ? 'update' : 'create'} worker` });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {/* Show submit errors */}
      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.submit}
        </div>
      )}

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
              ? 'bg-blue-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {isEditing ? 'Update Worker' : 'Add Worker'}
        </button>
      </div>
    </form>
  );
};

export default WorkerForm;