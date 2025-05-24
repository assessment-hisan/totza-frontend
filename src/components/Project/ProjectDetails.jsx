import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TransactionTable from '../ui/tables/TransactionTable';
import TransactionForm from '../TransactionForm';
import Modal from '../ui/modals/Modal';
import { ArrowLeft, PlusCircle, Trash2, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, accountsRes, vendorsRes] = await Promise.all([
          axiosInstance.get(`/company?project=${projectId}`),
          axiosInstance.get('/account'),
          axiosInstance.get('/vendor')
        ]);

        setTransactions(transactionsRes.data || []);
        setAccounts(accountsRes.data || []);
        setVendors(vendorsRes.data || []);

        const projectRes = await axiosInstance.get(`/project/${projectId}`);
        setProject(projectRes.data[0]);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleAddTransaction = async (formData) => {
    try {
      const payload = {
        ...Object.fromEntries(formData),
        project: projectId,
      };
  
      const res = await axiosInstance.post('/company', payload);
      setTransactions(prev => [res.data, ...prev]);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.response?.data?.message || 'Failed to add transaction');
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

  const projectDownloadPDF = () => {
    const pdf = new jsPDF('l', 'pt', 'a4');
    const projectTitle = project.title;
    const date = format(new Date(), 'dd MMM yyyy');
    
    // Add title
    pdf.setFontSize(18);
    pdf.text(`Project: ${projectTitle} - Transaction Report`, 40, 40);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${date}`, 40, 60);
    
    // Add project details
    pdf.setFontSize(12);
    pdf.text(`Description: ${project.description || '-'}`, 40, 80);
    pdf.text(`Start Date: ${formatDate(project.startDate)}`, 40, 95);
    pdf.text(`End Date: ${formatDate(project.endDate)}`, 40, 110);
    pdf.text(`Status: ${project.status}`, 40, 125);
    pdf.text(`Estimated Budget: ${Number(project.estimatedBudget).toLocaleString('en-IN')}`, 40, 140);
    
    // Add financial summary
    pdf.setFontSize(14);
    pdf.text('Financial Summary', 40, 170);
    pdf.setFontSize(12);
    pdf.text(`Total Credits: ${totals.credits.toLocaleString('en-IN')}`, 40, 190);
    pdf.text(`Total Debits: ${totals.debits.toLocaleString('en-IN')}`, 40, 205);
    pdf.text(`Current Balance: ${balance.toLocaleString('en-IN')}`, 40, 220);
    
    // Add transactions table header
    pdf.setFontSize(14);
    pdf.text('Transactions', 40, 250);
    
    // Create table
    const headers = ['Date', 'Type', 'Amount', 'Discount', 'Due Date', 'Added By', 'Purpose'];
    const rows = projectTransactions.map(txn => [
      format(new Date(txn.date), 'dd MMM yyyy'),
      txn.type,
      `₹${Number(txn.amount).toLocaleString('en-IN')}`,
      txn.discount ? `-${txn.discount}` : '-',
      txn.type === 'Due' && txn.dueDate ? format(new Date(txn.dueDate), 'dd MMM yyyy') : '-',
      txn.addedBy?.name || 'System',
      txn.purpose || '-'
    ]);
    
    // Simple table implementation
    pdf.setFontSize(10);
    let y = 270;
    
    // Table header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(40, y, 730, 20, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    headers.forEach((header, i) => {
      pdf.text(header, 50 + (i * 90), y + 15);
    });
    y += 20;
    
    // Table rows
    pdf.setFont(undefined, 'normal');
    rows.forEach((row) => {
      if (y > pdf.internal.pageSize.height - 40) {
        pdf.addPage();
        y = 40;
      }
      
      row.forEach((cell, cellIndex) => {
        pdf.text(cell, 50 + (cellIndex * 90), y + 15);
      });
      y += 20;
    });
    
    // Save the PDF
    pdf.save(`${projectTitle.replace(/ /g, '_')}_transactions_${date.replace(/ /g, '_')}.pdf`);
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

  if (!project) {
    return <div className="p-6">Project not found</div>;
  }

  // Calculate project financials
  const projectTransactions = transactions.filter(t => t.project?._id === projectId || t.project === projectId);
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
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-gray-800">{project.title}</h1>
              <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-2">{project.description}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Project Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">Start Date</h3>
          <p className="text-lg font-semibold mt-1">
            {formatDate(project.startDate)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">End Date</h3>
          <p className="text-lg font-semibold mt-1">
            {formatDate(project.endDate)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">Budget</h3>
          <p className="text-lg font-semibold mt-1">
            ₹{Number(project.estimatedBudget).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs font-medium text-gray-500">Created</h3>
          <p className="text-lg font-semibold mt-1">
            {formatDate(project.createdAt)}
          </p>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
          <div className={`p-3 rounded-lg ${balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
            <p className="text-xs font-medium">Current Balance</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
              ₹{balance.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-purple-800">Budget Usage</p>
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${budgetUsage > 90 ? 'bg-red-600' :
                    budgetUsage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                ></div>
              </div>
              <p className="text-lg font-bold mt-1 text-purple-600">
                {Math.round(budgetUsage)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{projectTransactions.length} total</p>
            <button
              onClick={projectDownloadPDF}
              className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition"
              title="Download as PDF"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {projectTransactions.length > 0 ? (
          <div>
            <div className="hidden sm:block">
              <TransactionTable
                transactions={projectTransactions}
                onDelete={handleDeleteTransaction}
              />
            </div>
            <div className="sm:hidden space-y-3">
              {projectTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.date)} • {transaction.category}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      From: {transaction.fromAccount}
                    </p>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 mb-2 text-sm">No transactions yet</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Add your first transaction
            </button>
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Transaction">
        <TransactionForm
          entityId={projectId}
          entityType="project"
          vendors={vendors}
          accounts={accounts}
          onSubmit={handleAddTransaction}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetails;