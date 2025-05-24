import React, { useState } from 'react';
import Modal from '../components/ui/modals/Modal';
import ItemForm from '../components/ui/tables/ItemForm'
import ItemTable from '../components/ui/tables/ItemTable'
import axiosInstance from '../utils/axiosInstance';

const Items = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateItem = async (formData) => {
    try {
      await axiosInstance.post('/items', formData);
      return true;
    } catch (error) {
      console.error('Error creating item:', error);
      return false;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Items</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Add Item
        </button>
      </div>

      <ItemTable />

      {isModalOpen && (
        <Modal  isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Item">
          <ItemForm 
            onSuccess={async (formData) => {
              const success = await handleCreateItem(formData);
              if (success) {
                setIsModalOpen(false);
              }
              return success;
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Items;