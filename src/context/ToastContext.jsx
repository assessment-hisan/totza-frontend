import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = ({ message, type = 'success', duration = 3000 }) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type }) => {
  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500',
  }[type];

  return (
    <div className={`fixed bottom-5 right-5 z-50 px-4 py-2 text-white rounded-lg shadow-lg ${bgColor}`}>
      {message}
    </div>
  );
};
