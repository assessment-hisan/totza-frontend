import React, { useState } from 'react';
import Modal from '../components/ui/modals/Modal'
import ItemForm from '../components/ui/tables/ItemForm'; // Create similar to VendorForm
import ItemTable from '../components/ui/tables/ItemTable'; // Displays item list

const Items = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Items</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>
      </div>

      <ItemTable />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ItemForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Items;
