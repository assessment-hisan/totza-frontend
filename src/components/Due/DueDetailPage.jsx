import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const DueDetailPage = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [due, setDue] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [dueRes, paymentsRes] = await Promise.all([
  //         axios.get(`/api/transactions/dues/${id}`),
  //         axios.get(`/api/transactions/payments?dueId=${id}`)
  //       ]);
  //       setDue(dueRes.data);
  //       setPayments(paymentsRes.data);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [id]);
  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      const dummyDue = {
        _id: '1',
        vendor: 'ABC Traders',
        purpose: 'Office Supplies',
        dueDate: new Date(),
        amount: 5000,
      };
  
      const dummyPayments = [
        {
          _id: 'p1',
          date: new Date('2024-10-01'),
          amount: 2000,
          account: { name: 'Bank A/C 1' },
          purpose: 'First partial payment',
          files: [],
        },
        {
          _id: 'p2',
          date: new Date('2024-10-10'),
          amount: 1000,
          account: { name: 'Cash' },
          purpose: 'Second payment',
          files: ['https://example.com/receipt1.pdf'],
        },
      ];
  
      setDue(dummyDue);
      setPayments(dummyPayments);
      setLoading(false);
    }, 1000);
  }, []);
  const handleAddPayment = () => {
    navigate(`/pay-due/${id}`);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!due) return <div className="p-8 text-center">Due not found</div>;

  const paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = due.amount - paidAmount;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Due Transaction Details</h1>
        <button
          onClick={handleAddPayment}
          disabled={remainingAmount <= 0}
          className={`px-4 py-2 rounded-md ${
            remainingAmount <= 0 ? 
            'bg-gray-300 cursor-not-allowed' : 
            'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Add Payment
        </button>
      </div>

      {/* Due Summary */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Vendor</h3>
            <p>{due.vendor}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Purpose</h3>
            <p>{due.purpose}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Due Date</h3>
            <p>{format(new Date(due.dueDate), 'PPP')}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Original Amount</h3>
            <p>₹{due.amount.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Amount Paid</h3>
            <p>₹{paidAmount.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Amount Remaining</h3>
            <p>₹{remainingAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Payment History</h2>
        {payments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No payments recorded yet</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(payment.date), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.account?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{payment.purpose}</div>
                    {payment.files?.length > 0 && (
                      <a 
                        href={payment.files[0]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Receipt
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DueDetailPage;