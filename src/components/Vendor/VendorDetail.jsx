import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { format } from 'date-fns';
import Modal from '../ui/modals/Modal';
import { ArrowLeft, Edit, PlusCircle, Download, Trash2 } from 'lucide-react';
import VendorForm from './VendorForm';
import TransactionForm from '../TransactionForm';
import { jsPDF } from 'jspdf';
import VendorPDF from '../pdf/VendorPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
const VendorDetail = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const [vendorRes, transactionsRes] = await Promise.all([
        axiosInstance.get(`vendor/${vendorId}`),
        axiosInstance.get(`vendor/transactions?vendor=${vendorId}`)
      ]);
      console.log(vendorRes.data)
      setVendor(vendorRes.data);
      setTransactions(transactionsRes.data.transactions || []);
      console.log(transactionsRes)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  const getAccounts = async () => {
    try {
      const res = await axiosInstance.get('account');
      setAccounts(res.data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const vendordownloadPDF = () => {
    const pdf = new jsPDF('l', 'pt', 'a4');
    const vendorName = vendor.companyName;
    const date = format(new Date(), 'dd MMM yyyy');

    // Add title
    pdf.setFontSize(18);
    pdf.text(` ${vendorName} - Transaction Report `, 40, 40);
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${date}`, 40, 60);

    // Add vendor info
    pdf.setFontSize(12);
    pdf.text(`Vendor Type: ${vendor.vendorType}`, 40, 80);
    pdf.text(`Contact: ${vendor.contactNumber}`, 40, 95);
    pdf.text(`Address: ${vendor.address}`, 40, 110);

    // Add financial summary
    pdf.setFontSize(14);
    pdf.text('Financial Summary', 40, 140);
    pdf.setFontSize(12);
    pdf.text(`Total Credits: ${totals.credits.toLocaleString('en-IN')}`, 40, 160);
    pdf.text(`Total Debits: ${totals.debits.toLocaleString('en-IN')}`, 40, 175);
    pdf.text(`Current Balance: ${balance.toLocaleString('en-IN')}`, 40, 190);

    // Add transactions table header
    pdf.setFontSize(14);
    pdf.text('Transactions', 40, 220);

    // Create table
    const headers = ['Date', 'Type', 'Amount', 'Discount', 'Due Date', 'Added By', 'Purpose'];
    const rows = transactions.map(txn => [
      format(new Date(txn.date), 'dd MMM yyyy'),
      txn.type,
      `${txn.amount.toLocaleString('en-IN')}`,
      txn.discount ? `-₹${txn.discount}` : '-',
      txn.type === 'Due' && txn.dueDate ? format(new Date(txn.dueDate), 'dd MMM yyyy') : '-',
      txn.addedBy?.name || 'System',
      txn.purpose || 'System'
    ]);

    // Simple table implementation
    pdf.setFontSize(10);
    let y = 240;

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
    rows.forEach((row, rowIndex) => {
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
    pdf.save(`${vendorName.replace(/ /g, '_')}_transactions_${date.replace(/ /g, '_')}.pdf`);
  };
  const handleDeleteTransaction = async (txnId) => {
    try {
      await axiosInstance.delete(`/company/${txnId}`);
      setTransactions((prev) => prev.filter((t) => t._id !== txnId));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.response?.data?.message || 'Failed to delete transaction');
    }
  };
  useEffect(() => {
    fetchVendorData();

    getAccounts();
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
          <p className="text-sm text-red-700">{error}</p>
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

  if (!vendor) return <div className="p-6">Vendor not found</div>;

  const vendorTransactions = transactions.filter(t => t.vendor?._id === vendorId);
  const totals = vendorTransactions.reduce((acc, txn) => {
    if (txn.type === 'Credit') acc.credits += Number(txn.amount);
    if (txn.type === 'Debit' || txn.type === 'Due') acc.debits += Number(txn.amount);
    return acc;
  }, { credits: 0, debits: 0 });

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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{vendor.companyName}</h1>
            <p className="text-gray-600 text-sm mt-1">{vendor.vendorType}</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        </div>

        {/* Vendor Details Section - Redesigned */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Vendor Details</h2>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition"
              title="Edit Vendor"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-gray-500">Contact Number</h3>
              <p className="text-lg font-semibold mt-1">{vendor.contactNumber || '-'}</p>
            </div>

            {/* <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-gray-500">type</h3>
              <p className="text-lg font-semibold mt-1">{vendor.type || '-'}</p>
            </div> */}

            {/* <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-gray-500">GST Number</h3>
              <p className="text-lg font-semibold mt-1">{vendor.gstNumber || '-'}</p>
            </div> */}

            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-xs font-medium text-gray-500">Address</h3>
              <p className="text-lg font-semibold mt-1">{vendor.address || '-'}</p>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
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
            <div className={`p-3 rounded-lg ${balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
              <p className="text-xs font-medium">Current Balance</p>
              <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
                ₹{balance.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">{vendorTransactions.length} total</p>
              <PDFDownloadLink
                document={
                  <VendorPDF
                    vendor={vendor}
                    transactions={vendorTransactions}
                    totals={totals}
                    balance={balance}
                  />
                }
                fileName={`${vendor.companyName.replace(/\\s+/g, '_')}_report.pdf`}
                 className="inline-flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition"
              >
                {({ loading }) => (loading ? 'Generating...' :  (<><Download className="w-4 h-4" /> PDF</>))}
              </PDFDownloadLink>

            </div>
          </div>
              {vendorTransactions.length === 0 ? (
          <div className="bg-white border border-gray-200 p-6 rounded-lg text-center text-gray-500">
            <p className="mb-4">No transactions found for this vendor.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              <PlusCircle className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        ) : (
          <div id="transactions-pdf" className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
             <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Added By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn, index) => (
                  <tr
                    key={txn._id}
                    className={`transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {format(new Date(txn.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${txn.type === 'Due' ? 'bg-amber-100 text-amber-800' :
                        txn.type === 'Payment' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.discount ? (
                        <span className="text-red-600 font-medium">-₹{txn.discount}</span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.type === 'Due' && txn.dueDate ? (
                        <span className={`${new Date(txn.dueDate) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-600'
                          }`}>
                          {format(new Date(txn.dueDate), 'dd MMM yyyy')}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span>{txn.addedBy?.name || 'System'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteTransaction(txn._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        title="Delete Transaction"
                      >
                        <Trash2 />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
       
        </div>

        {/* Add Transaction Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
          <TransactionForm
            entityId={vendorId}
            entityType="vendor"
            accounts={accounts}
            onSubmit={async (formData) => {
              try {
                await axiosInstance.post('/company', formData);
                setIsModalOpen(false);
                fetchVendorData(); // Refresh data
              } catch (err) {
                console.error(err);
                throw err;
              }
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

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
    </div>
  );
};

export default VendorDetail;
