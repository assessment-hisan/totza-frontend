import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Modal from '../ui/modals/Modal';
import { ArrowLeft, Edit, PlusCircle, Trash2 } from 'lucide-react';
import WorkerForm from './WorkerForm';
import TransactionForm from "../TransactionForm"


const WorkerDetail = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accounts, setAccounts] = useState([])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      const [workerRes, transactionsRes] = await Promise.all([
        axiosInstance.get(`worker/${workerId}`),
        axiosInstance.get(`worker/transactions?worker=${workerId}`)
      ]);

      setWorker(workerRes.data);

      console.log("transaction res", transactionsRes.data.transactions)
      setTransactions(transactionsRes.data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load worker data');
    } finally {
      setLoading(false);
    }
  };

  const getAccounts = async () => {
    try {
      const response = await axiosInstance.get('account');
      if (response.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.log("Error fetching accounts:", error);
      setError("Failed to load accounts. Please refresh the page.");
    }
  };
  const handleDeleteTransaction = async (txnId) => {
    try {
      await axiosInstance.delete(`/company/${txnId}`);
      setTransactions(prev => prev.filter(t => t._id !== txnId));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.response?.data?.message || 'Failed to delete transaction');
    }
  };
  useEffect(() => {
    fetchWorkerData();
    getAccounts()
  }, [workerId]);

  const handleUpdateWorker = async (updatedData) => {
    try {
      await axiosInstance.put(`workers/${workerId}`, updatedData);
      fetchWorkerData();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating worker:', err);
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

  if (!worker) {
    return <div className="p-6">Worker not found</div>;
  }

  // Calculate worker financials
  const workerTransactions = transactions.filter(t => t.worker?._id === workerId);
  const totals = workerTransactions.reduce(
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
              <h1 className="text-2xl font-bold text-gray-800">{worker.name}</h1>
              <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${worker.status === 'Active' ? 'bg-green-100 text-green-800' :
                worker.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                {worker.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2">{worker.role}</p>
          </div>
          <div className="mt-4 sm:mt-0">

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" /> Add Transaction
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Edit className="w-4 h-4" /> Edit Worker
            </button>
          </div>
        </div>
      </div>

      {/* Worker Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">Contact Number</h3>
          <p className="text-lg font-semibold mt-1">{worker.contactNumber}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">Daily Wage</h3>
          <p className="text-lg font-semibold mt-1">
            ₹{Number(worker.dailyWage).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">Joining Date</h3>
          <p className="text-lg font-semibold mt-1">
            {formatDate(worker.joiningDate)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">Assigned Project</h3>
          <p className="text-lg font-semibold mt-1">
            {worker.assignedProject?.title || 'Not assigned'}
          </p>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Address</h2>
        <p className="text-gray-600">{worker.address}</p>
      </div>

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
          <div className={`p-3 rounded-lg ${balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'
            }`}>
            <p className="text-xs font-medium">Current Balance</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'
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
            {transactions.length} total
          </p>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {transaction.description || 'No description'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'Credit'
                        ? 'bg-green-100 text-green-800'
                        : transaction.type === 'Debit'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`font-medium ${transaction.type === 'Credit'
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}>
                        ₹{Number(transaction.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {transaction.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        title="Delete Transaction"
                      >
                        <Trash2/>
                      </button>
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 mb-2 text-sm">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Edit Worker Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Worker">
        <WorkerForm
          initialData={worker}
          onSubmit={handleUpdateWorker}
          onCancel={() => setIsEditModalOpen(false)}
          isEditMode={true}
        />
      </Modal>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <TransactionForm
          entityId={workerId} // or vendorId/projectId
          entityType="workers" // or "vendor"/"project"
          accounts={accounts}
          onSubmit={async (formData) => {
            try {
              const res = await axiosInstance.post('company', formData);
              console.log(res)
              fetchWorkerData(); // Refresh data
            } catch (err) {
              throw err;

            }
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default WorkerDetail;