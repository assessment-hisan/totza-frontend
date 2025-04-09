import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

import { ToastProvider } from './context/ToastContext';

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <div className="">
          <AppRoutes />
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;
