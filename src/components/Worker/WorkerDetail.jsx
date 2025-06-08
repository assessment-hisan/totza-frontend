import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Modal from '../ui/modals/Modal';
import { ArrowLeft, Edit2, PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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
      setTransactions(transactionsRes.data.transactions || []);
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

  const handleAddTransaction = async (formData) => {
    try {
      const payload = { ...Object.fromEntries(formData), worker: workerId };
      const res = await axiosInstance.post('/company', payload);
      setTransactions(prev => [res.data, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleEditWorker = async (formData) => {
    try {
      const res = await axiosInstance.put(`/worker/${workerId}`, formData);
      setWorker(res.data);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update worker');
    }
  };

  useEffect(() => {
    fetchWorkerData();
    getAccounts();
  }, [workerId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!worker) {
    return <div className="text-center py-10">Worker not found</div>;
  }

  // Calculate worker financials
  const workerTransactions = transactions.filter(t => t.worker?._id === workerId || t.worker === workerId);
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{worker.name}</h1>
              <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${worker.status === 'Active' ? 'bg-green-100 text-green-800' :
                worker.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                {worker.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{worker.role}</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            <PlusCircle className="w-4 h-4" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Accordion for Worker Details */}
      <div className="bg-white rounded-lg border shadow-sm">
        <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <span>Worker Details</span>
          <div className="flex items-center gap-2">
            {showDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                className="flex gap-2 bg-blue-100 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title="Edit Worker"
              >
                <span>Edit</span>
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        {showDetails && (
          <div className="px-4 pb-4 space-y-4">
            {/* Worker Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Contact Number', value: worker.contactNumber },
                { label: 'Daily Wage', value: `₹${Number(worker.dailyWage).toLocaleString('en-IN')}` },
                { label: 'Joining Date', value: formatDate(worker.joiningDate) },
                { label: 'Assigned Project', value: worker.assignedProject?.title || 'Not assigned' }
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</h3>
                  <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
                </div>
              ))}
            </div>
            
            {/* Address Section */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Address</h3>
              <p className="text-sm text-gray-700">{worker.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Financial Overview */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-green-800">Total Credits</p>
            <p className="text-xl font-bold text-green-600 mt-1">
              ₹{totals.credits.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-red-800">Total Debits</p>
            <p className="text-xl font-bold text-red-600 mt-1">
              ₹{totals.debits.toLocaleString('en-IN')}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
            <p className="text-xs font-medium text-gray-700">Current Balance</p>
            <p className={`text-xl font-bold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
              ₹{balance.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
          <p className="text-xs text-gray-500">total {workerTransactions.length}</p>
        </div>

        {workerTransactions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {workerTransactions.map((transaction) => (
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
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <p className="text-gray-500 mb-2 text-sm">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <TransactionForm
          entityId={workerId}
          entityType="workers"
          accounts={accounts}
          onSubmit={handleAddTransaction}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Edit Worker Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Worker">
        <WorkerForm
          initialData={worker}
          onClose={() => setIsEditModalOpen(false)}
          refreshWorkers={fetchWorkerData}
          isEditing={true}
          onSubmit={handleEditWorker}
        />
      </Modal>
    </div>
  );
};

export default WorkerDetail;