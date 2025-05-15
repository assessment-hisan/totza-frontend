import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Loader, AlertCircle } from 'lucide-react';

const VendorForm = ({ onClose, refreshVendors, initialData, isEditMode = false }) => {
  const [formData, setFormData] = useState(initialData || { 
    companyName: '',
    contactNumber: '',
    address: '',
    vendorType: 'Material Supplier',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newErrors = {};
    
    
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
   

    setErrors(newErrors);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      if (isEditMode) {
        await axiosInstance.put(`vendor/${initialData._id}`, formData);
      } else {
        await axiosInstance.post('vendor', formData);
      }
      refreshVendors();
      onClose();
    } catch (error) {
      console.error('Error saving vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md">
      {/* Form Header */}
      <div className="bg-gray-100 p-6 rounded-t-lg border-b border-blue-100">
        <h2 className="text-2xl font-semibold text-black">
          {isEditMode ? 'Edit Vendor Details' : 'New Vendor Registration'}
        </h2>
        <p className="text-sm text-slate-900 mt-1">Fields marked with * are required</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Basic Information Section */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.companyName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.companyName}
                </p>
              )}
            </div>
            
            {/* Vendor Type */}
            <div>
              <label htmlFor="vendorType" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Type <span className="text-red-500">*</span>
              </label>
              <select
                id="vendorType"
                name="vendorType"
                value={formData.vendorType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select vendor type</option>
                <option value="Material Supplier">Material Supplier</option>
                <option value="Equipment Rental">Equipment Rental</option>
                <option value="Service Provider">Service Provider</option>
                <option value="Subcontractor">Subcontractor</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Contact Information Section */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3 pb-2 border-b">
            Contact Information
          </h3>
          
          <div className="space-y-6">
            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                    errors.contactNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter contact number"
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.contactNumber}
                </p>
              )}
            </div>
            
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                    errors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter complete address"
                />
                <span className="absolute top-3 left-0 flex items-center pl-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.address}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Actions - Sticky Footer */}
      <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className={`px-6 py-2 rounded-md transition-colors flex items-center justify-center gap-2 min-w-32 ${
            loading || Object.keys(errors).length > 0
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {isEditMode ? 'Update Vendor' : 'Add Vendor'}
        </button>
      </div>
    </form>
  );
};

export default VendorForm;