import React, { useState } from 'react';
import Modal from '../components/ui/modals/Modal';
import VendorForm from '../components/ui/tables/ItemForm'; // You can create this form similarly to TransactionForm
import VendorTable from '../components/ui/tables/ItemTable'; // A simple table to list vendors

const Vendors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendors</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Vendor
        </button>
      </div>

      <VendorTable />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <VendorForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Vendors;
