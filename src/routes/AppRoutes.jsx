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
import DueDetailPage from '../components/Due/DueDetailPage';
import DueListPage from "../components/Due/DueListPage"
import ProjectsList from '../components/Project/ProjectList';
import ProjectDetails from '../components/Project/ProjectDetails';
import WorkerDetail from '../components/Worker/WorkerDetail';
import WorkerList from '../components/Worker/WorkerList';
import VendorDetail from '../components/Vendor/VendorDetail';
import VendorList from '../components/Vendor/VendorList';

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
      
      <Route path="/items" element={<Items />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/dues" element={<DueListPage/>} />
      <Route path="/dues/:dueId" element={<DueDetailPage />} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/project/:projectId" element={<ProjectDetails />} />
      <Route path="/workers" element={<WorkerList />} />
      <Route path="/workers/:workerId" element={<WorkerDetail />} />
      <Route path="/vendors" element={<VendorList />} />
      <Route path="/vendors/:vendorId" element={<VendorDetail />} />
    </Routes>



  );
};

export default AppRoutes;
