import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Login from "../pages/auth/login"
import Register from "../pages/auth/register"
import ChangePassword from '../pages/auth/changePassword';
import Dashboard from '../pages/Dashboard';
import CompanyTransactions from '../pages/CompanyTransactions';
import PersonalTransactions from '../pages/PersonalTransactions';
import Vendors from '../pages/Vendors';
import Items from '../pages/Items';
import Accounts from "../pages/Accounts"
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import PayDueForm from '../components/ui/tables/PayDueForm';
import DueDetailPage from '../components/Due/DueDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/company-transactions" element={<CompanyTransactions />} />
      <Route path="/personal-transactions" element={<PersonalTransactions />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/items" element={<Items />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/dues/:dueId/pay" element={<PayDueForm  />} />
      <Route path="/dues/:dueId" element={<DueDetailPage />} />
    </Routes>



  );
};

export default AppRoutes;
