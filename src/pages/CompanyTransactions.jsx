import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/ui/tables/TransactionForm';
import TransactionTable from '../components/ui/tables/TransactionTable';
import Modal from '../components/ui/modals/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import BatchTransactionForm from '../components/ui/BatchTransactionForm/BatchTransactionForm';
import { Plus, Upload, Search } from 'lucide-react';
import { calculateTotalBalance } from '../utils/helper';

const CompanyTransactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyTransactions, setCompanyTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState({ status: false, progress: 0 });
  const [options, setOptions] = useState({
    accounts: [],
    projects: [],
    vendors: [],
    workers: [],
    items: []
  });
  const location = useLocation();
  const navigate = useNavigate();

  const getCompanyTnx = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('company');
      let transactionsData = [];
      if (Array.isArray(res.data)) {
        transactionsData = res.data;
      } else if (res.data && typeof res.data === 'object') {
        if (Array.isArray(res.data.data)) {
          transactionsData = res.data.data;
        } else {
          transactionsData = [res.data];
        }
      }
      setCompanyTransactions(transactionsData);
    } catch (error) {
      console.log("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getOptions = async () => {
    try {
      const [accountRes, projectRes, vendorRes, workerRes, itemsRes] = await Promise.all([
        axiosInstance.get('account'),
        axiosInstance.get('project'),
        axiosInstance.get('vendor'),
        axiosInstance.get('worker'),
        axiosInstance.get('item')
      ]);
      setOptions({
        accounts: accountRes.data,
        projects: projectRes.data,
        vendors: vendorRes.data,
        workers: workerRes.data,
        items: itemsRes.data
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openForm') === 'true') {
      setIsModalOpen(true);
    }
    if (params.get('openBatchForm') === 'true') {
      setIsBatchModalOpen(true);
    }
  }, [location.search]);

  const handleAddClick = () => {
    setIsModalOpen(true);
    navigate('?openForm=true', { replace: false });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/company-transactions', { replace: true });
  };

  const handleSubmit = async (formData) => {
    try {
      const res = await axiosInstance.post('company', formData);
      if (res.data) {
        setCompanyTransactions(prev => [res.data, ...prev]);
      }
      handleModalClose();
      getCompanyTnx();
    } catch (err) {
      console.error('Failed to add transaction:', err);
    }
  };

  const handleBatchSubmit = async (batchData) => {
    try {
      setSubmitting({ status: true, progress: 0 });
      const transactions = Array.isArray(batchData) ? batchData : [batchData];
      const res = await axiosInstance.post('company/many', transactions, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setSubmitting(prev => ({ ...prev, progress: percentCompleted }));
        }
      });
      if (res.data) {
        const { successCount, failedCount, transactions: processedTxns } = res.data;
        if (Array.isArray(processedTxns)) {
          setCompanyTransactions(prev => [...processedTxns, ...prev]);
        }
        await getCompanyTnx();
        if (failedCount > 0) {
          console.log(`Processed ${successCount} transactions, ${failedCount} failed`);
        } else {
          console.log(`Successfully processed ${successCount} transactions`);
        }
        handleBatchModalClose();
      }
    } catch (err) {
      console.error('Batch submission failed:', err);
      if (err.response) {
        const { status, data } = err.response;
        console.log("Error response data:", data);
        if (status === 422 && data?.errors) {
          console.log(`Validation failed: ${Array.isArray(data.errors) ? data.errors.join(', ') : JSON.stringify(data.errors)}`);
        } else {
          console.log(data?.message || 'Batch processing failed');
        }
      } else if (err.request) {
        console.log('No response received from server - please try again');
      } else {
        console.log('Network error - please try again');
      }
    } finally {
      setSubmitting({ status: false, progress: 0 });
    }
  };

  const handleBatchAddClick = () => {
    setIsBatchModalOpen(true);
    navigate('?openBatchForm=true', { replace: false });
  };

  const handleBatchModalClose = () => {
    setIsBatchModalOpen(false);
    navigate('/company-transactions', { replace: true });
  };

  useEffect(() => {
    getCompanyTnx();
    getOptions();
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Company Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage all company financial transactions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
          <button
            onClick={handleBatchAddClick}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200"
          >
            <Upload className="w-4 h-4" />
            <span>Add Batch</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <button 
              onClick={getCompanyTnx}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{companyTransactions.length}</span> transactions
              </p>
            </div>
            <TransactionTable transactions={companyTransactions} />
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} size="lg">
          <div className="p-4">
            <TransactionForm
              type="company"
              accounts={options.accounts}
              projects={options.projects}
              vendors={options.vendors}
              workers={options.workers}
              items={options.items}
              onSubmit={handleSubmit}
              onSuccess={handleModalClose}
            />
          </div>
        </Modal>
      )}

      {isBatchModalOpen && (
        <Modal isOpen={isBatchModalOpen} onClose={handleBatchModalClose} size="xl">
          <div className="p-4">
            <BatchTransactionForm
              accounts={options.accounts}
              projects={options.projects}
              vendors={options.vendors}
              workers={options.workers}
              items={options.items}
              onSubmit={handleBatchSubmit}
              onSuccess={handleBatchModalClose}
            />
          </div>
        </Modal>
      )}

      {submitting.status && (
        <div className="fixed bottom-6 right-6 bg-white p-4 shadow-xl rounded-xl z-50 border border-gray-200 w-64">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800">Upload Progress</h3>
            <span className="text-sm text-gray-500">{submitting.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${submitting.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Uploading {submitting.current}/{submitting.total} transactions...
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyTransactions;