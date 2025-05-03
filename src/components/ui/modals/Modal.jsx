import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // 🔥 This line is crucial

  return (
    <div className="overflow-auto py-40 fixed  inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mt-25 bg-white rounded-2xl shadow-lg w-full max-w-md mx-4  py-6 relative md:min-w-5xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="overflow-y-auto max-h-screen ">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
