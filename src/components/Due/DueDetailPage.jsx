import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { format } from 'date-fns';
import PayDueForm from '../ui/tables/PayDueForm';
import Modal from "../ui/modals/Modal"
import {Trash2} from 'lucide-react'
const DueDetailPage = () => {
  const { dueId } = useParams();
  const navigate = useNavigate();
  const [due, setDue] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [dueRes, paymentsRes] = await Promise.all([
          axiosInstance.get(`due/${dueId}`),
          axiosInstance.get(`/due/${dueId}/payments`)
        ]);
        console.log(dueRes.data.data.payments)
        setDue(dueRes.data.data);
        setPayments(paymentsRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (show toast, etc.)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dueId]);

 
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!due) return <div className="p-8 text-center">Due not found</div>;

  const paidAmount = payments?.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = due.amount - paidAmount ;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header with action button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Due Transaction Details</h1>
          <p className="text-sm text-gray-500 mt-1">ID: {dueId}</p>
        </div>
        <button
          onClick={() => setShowPayModal(true)}
          disabled={remainingAmount <= 0}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${remainingAmount <= 0
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Payment
        </button>
      </div>

      {/* Due Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vendor */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Vendor</h3>
            <p className="text-gray-800 font-medium">{due?.vendor || "N/A"}</p>
          </div>

          {/* Purpose */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Purpose</h3>
            <p className="text-gray-800 font-medium">{due.purpose}</p>
          </div>

          {/* Due Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
            <p className="text-gray-800 font-medium">{format(new Date(due.dueDate), 'PPP')}</p>
          </div>

          {/* Original Amount */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600 mb-1">Original Amount</h3>
            <p className="text-blue-800 font-bold">₹{due.amount?.toFixed(2)}</p>
          </div>

          {/* Amount Paid */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600 mb-1">Amount Paid</h3>
            <p className="text-green-800 font-bold">₹{paidAmount?.toFixed(2)}</p>
          </div>

          {/* Amount Remaining */}
          <div className={`p-4 rounded-lg ${remainingAmount > 0 ? 'bg-amber-50' : 'bg-gray-50'
            }`}>
            <h3 className={`text-sm font-medium ${remainingAmount > 0 ? 'text-amber-600' : 'text-gray-600'
              } mb-1`}>
              Amount Remaining
            </h3>
            <p className={`font-bold ${remainingAmount > 0 ? 'text-amber-800' : 'text-gray-800'
              }`}>
              ₹{remainingAmount?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700">Payment History</h2>
          <span className="text-sm text-gray-500">
            {payments?.length} {payments?.length === 1 ? 'payment' : 'payments'}
          </span>
        </div>

        {payments?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">No payments recorded yet</p>
            <button
              onClick={() => setShowPayModal(true)}
              disabled={remainingAmount <= 0}
              className={`mt-4 px-4 py-2 rounded-md text-sm ${remainingAmount <= 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              Make First Payment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments?.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(payment.date), 'dd MMM yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(payment.date), 'hh:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        ₹{payment.amount?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-semibold rounded-3xl bg-green-100 text-green-800">
                      ₹{payment.discount?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {payment.account?.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.account?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.account?.accountType || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{payment.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPaymentId(payment._id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <Trash2/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)}>
        <PayDueForm
          dueId={dueId}
          // accounts={accounts}
          maxAmount={remainingAmount }
          onSuccess={(newPayment) => {
            setPayments(prev => [newPayment, ...prev]);
            setShowPayModal(false);
          }}
          onCancel={() => setShowPayModal(false)}
        />
      </Modal>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this payment?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await axiosInstance.delete(`due/${dueId}/payments/${selectedPaymentId}`)
                  setPayments(prev => prev.filter(p => p._id !== selectedPaymentId));
                  setShowDeleteModal(false);
                } catch (err) {
                  console.error('Error deleting payment:', err);
                  // Optionally show a toast or error message here
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DueDetailPage;