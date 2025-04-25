import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // 🔥 This line is crucial

  return (
    <div className="pt-20 fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-4  py-6 relative md:max-w-lg lg:max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        <div className="overflow-y-auto max-h-screen">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
