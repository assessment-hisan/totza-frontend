import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Modal from "../ui/modals/Modal";
import { PlusCircle, Trash2 } from 'lucide-react';
import ConfirmModal from '../ui/modals/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import VendorForm from './VendorForm';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const res = await axiosInstance.get('vendor');
      setVendors(res.data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vendorId) => {
    if (!vendorId) return;
    try {
      await axiosInstance.delete(`/vendor/${vendorId}`);
      fetchVendors();
      setIsDeleteModalOpen(false);
      setVendorToDelete(null);
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Vendors</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Add Vendor
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <tr 
                  key={vendor._id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/vendors/${vendor._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{vendor.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{vendor.contactNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{vendor.vendorType}</td>
                  <td className="px-6 py-3 flex justify-center whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setVendorToDelete(vendor._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Vendor"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Vendor"
      >
        <VendorForm onClose={() => setIsModalOpen(false)} refreshVendors={fetchVendors} />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        id={vendorToDelete}
        title="Delete Vendor?"
        message="This action cannot be undone. Are you sure you want to delete this vendor?"
      />
    </div>
  );
};

export default VendorList;
