import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TransactionTable from '../ui/tables/TransactionTable';
import Modal from '../ui/modals/Modal';
import { ArrowLeft, Edit, Loader } from 'lucide-react';
import VendorForm from './Vendorform';

const VendorDetail = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const [vendorRes,  ] = await Promise.all([
        axiosInstance.get(`vendor/${vendorId}`),
        // axiosInstance.get(`transactions?vendor=${vendorId}`)
      ]);
      
      setVendor(vendorRes.data);
      console.log(vendorRes)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [vendorId]);

  const handleUpdateVendor = async (updatedData) => {
    try {
      await axiosInstance.put(`vendors/${vendorId}`, updatedData);
      fetchVendorData();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating vendor:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!vendor) {
    return <div className="p-6">Vendor not found</div>;
  }


  // Calculate vendor financials
  const vendorTransactions = transactions.filter(t => t.vendor?._id === vendorId);
  const totals = vendorTransactions.reduce(
    (acc, txn) => {
      if (txn.type === 'Credit') acc.credits += Number(txn.amount);
      if (txn.type === 'Debit' || txn.type === 'Due') acc.debits += Number(txn.amount);
      return acc;
    },
    { credits: 0, debits: 0 }
  );

  const balance = totals.credits - totals.debits;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">{vendor.companyName}</h1>
          
            </div>
            <p className="text-gray-600 text-sm mt-2"> {vendor.vendorType}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Edit className="w-4 h-4" /> Edit Vendor
            </button>
          </div>
        </div>
      </div>
  
      {/* Vendor Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">Contact Number</h3>
          <p className="text-lg font-semibold mt-1">{vendor.contactNumber}</p>
        </div>
      
      
      </div>
  
      {/* Address Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Address</h2>
        <p className="text-gray-600">{vendor.address}</p>
      </div>

      {/* Bank Details Section */}
      {/* <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-medium text-gray-500">Bank Name</h3>
            <p className="text-gray-600">{vendor.bankName || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500">Account Number</h3>
            <p className="text-gray-600">{vendor.accountNumber || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-500">Tax ID</h3>
            <p className="text-gray-600">{vendor.taxId || 'N/A'}</p>
          </div>
        </div>
      </div> */}
  
      {/* Financial Overview */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-green-800">Total Credits</p>
            <p className="text-xl font-bold text-green-600">
              ₹{totals.credits.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-red-800">Total Debits</p>
            <p className="text-xl font-bold text-red-600">
              ₹{totals.debits.toLocaleString('en-IN')}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${
            balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'
          }`}>
            <p className="text-xs font-medium">Current Balance</p>
            <p className={`text-xl font-bold ${
              balance >= 0 ? 'text-blue-600' : 'text-yellow-600'
            }`}>
              ₹{balance.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
  
      {/* Transactions Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
          <p className="text-xs text-gray-500">
            {vendorTransactions.length} total
          </p>
        </div>
        
        {vendorTransactions.length > 0 ? (
          <TransactionTable 
            transactions={vendorTransactions} 
            showVendor={false}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 mb-2 text-sm">No transactions yet</p>
          </div>
        )}
      </div>
  
      {/* Edit Vendor Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Vendor">
        <VendorForm 
          initialData={vendor}
          onSubmit={handleUpdateVendor}
          onCancel={() => setIsEditModalOpen(false)}
          isEditMode={true}
        />
      </Modal>
    </div>
  );
};

export default VendorDetail;