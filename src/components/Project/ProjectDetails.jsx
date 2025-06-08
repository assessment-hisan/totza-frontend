// Updated ProjectDetails.jsx with edit functionality
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TransactionTable from '../ui/tables/TransactionTable';
import TransactionForm from '../TransactionForm';
import Modal from '../ui/modals/Modal';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import { ArrowLeft, PlusCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProjectPDF from '../pdf/projectPdf';
import ProjectEditForm from './ProjectEditForm'; // We'll create this component

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, accountsRes, vendorsRes] = await Promise.all([
          axiosInstance.get(`/project/transactions?project=${projectId}`),
          axiosInstance.get('/account'),
          axiosInstance.get('/vendor')
        ]);
        console.log(transactionsRes.data)
        setTransactions(transactionsRes.data || []);
        setAccounts(accountsRes.data || []);
        setVendors(vendorsRes.data || []);

        const projectRes = await axiosInstance.get(`/project/${projectId}`);
        setProject(projectRes.data[0]);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleAddTransaction = async (formData) => {
    try {
      const payload = { ...Object.fromEntries(formData), project: projectId };
      const res = await axiosInstance.post('/company', payload);
      setTransactions(prev => [res.data, ...prev]);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleDeleteTransaction = async (txnId) => {
    try {
      await axiosInstance.delete(`/company/${txnId}`);
      setTransactions(prev => prev.filter(t => t._id !== txnId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const handleEditProject = async (formData) => {
    try {
      const res = await axiosInstance.put(`/project/${projectId}`, formData);
      setProject(res.data);
      setIsEditFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!project) return <div className="text-center py-10">Project not found</div>;

  const projectTransactions = transactions.transactions
  // const projectTransactions = transactions.filter(t => t.project?._id === projectId || t.project === projectId);
  // console.log(projectTransactions)
  const totals = projectTransactions.reduce(
    (acc, txn) => {
      if (txn.type === 'Credit') acc.credits += Number(txn.amount);
      if (txn.type === 'Debit' || txn.type === 'Due') acc.debits += Number(txn.amount);
      return acc;
    },
    { credits: 0, debits: 0 }
  );

  const balance = totals.credits - totals.debits;
  const budgetUsage = project.estimatedBudget > 0 ? (totals.debits / project.estimatedBudget) * 100 : 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 text-sm mt-1">{project.description}</p>
          </div>
          <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            <PlusCircle className="w-4 h-4" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Accordion for Project Details */}
      <div className="bg-white rounded-lg border shadow-sm">
        <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <span>Project Details</span>
          <div className="flex items-center gap-2">
            {showDetails && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditFormOpen(true);
                }}
                className="flex gap-2 bg-blue-100 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                title="Edit Project"
              >
                <span>Edit</span>
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        {showDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-4">
            {[{ label: 'Start Date', value: formatDate(project.startDate) }, { label: 'End Date', value: formatDate(project.endDate) }, { label: 'Budget', value: `₹${project.estimatedBudget.toLocaleString('en-IN')}` }, { label: 'Created', value: formatDate(project.createdAt) }].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</h3>
                <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
              </div>
            ))}
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
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">total {projectTransactions.length}</p>
            <PDFDownloadLink
              document={<ProjectPDF totals={totals} project={project} transactions={projectTransactions} />}
              fileName={`${project.title.replace(/ /g, '_')}_transactions.pdf`}
              className="inline-flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition"
            >
              {({ loading }) => loading ? 'Generating...' : (<><Download className="w-4 h-4" /> PDF</>)}
            </PDFDownloadLink>
          </div>
        </div>
        <TransactionTable
          transactions={projectTransactions}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Transaction"
      >
        <TransactionForm
          entityId={projectId}
          entityType="project"
          vendors={vendors}
          accounts={accounts}
          onSubmit={handleAddTransaction}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit Project"
      >
        <ProjectEditForm
          project={project}
          onSubmit={handleEditProject}
          onCancel={() => setIsEditFormOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetails;