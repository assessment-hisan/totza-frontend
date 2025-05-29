import React, { useState } from 'react';
import Modal from '../components/ui/modals/Modal';
import ConfirmModal from '../components/ui/modals/ConfirmModal';
import ItemForm from '../components/ui/tables/ItemForm';
import ItemTable from '../components/ui/tables/ItemTable';
import axiosInstance from '../utils/axiosInstance';

const Items = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [reload, setReload] = useState(false);

  const handleCreateItem = async (formData) => {
    try {
      await axiosInstance.post('/item', formData);
      setReload((prev) => !prev);
      return true;
    } catch (error) {
      console.error('Error creating item:', error);
      return false;
    }
  };

  const handleDeleteClick = (itemId) => {
    setItemToDelete(itemId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/item/${itemToDelete}`);
      setReload((prev) => !prev);
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
      <div>
      <h2 className="text-3xl font-bold text-gray-900">Items</h2>
      <h3 className='text-gray-600 font-medium '>here you manage all items</h3>
      </div>
      </div>

      <ItemTable 
        reload={reload} 
        onDelete={handleDeleteClick}
        onAdd={() => setIsModalOpen(true)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Item">
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

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item? This action cannot be undone."
        id={itemToDelete}
      />
    </div>
  );
};

export default Items;