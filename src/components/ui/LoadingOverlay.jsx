// components/Shared/LoadingOverlay.jsx

import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="text-white text-lg font-semibold animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default LoadingOverlay;
