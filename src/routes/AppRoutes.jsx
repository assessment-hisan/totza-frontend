import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import CreateProject from '../pages/createProject';
import ProjectDetails from '../pages/ProjectDetails';
import NotFound from '../pages/NotFound';
import Login from "../pages/auth/login"
import ChangePassword from '../pages/auth/changePassword';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path="/" element={<Home />} />
      <Route path="/create-project" element={<CreateProject />} />
      
      <Route path="/project/:id" element={<ProjectDetails />} />
      <Route path="/change-password" element={<ChangePassword/>}/>
      <Route path="*" element={<NotFound />} />


    </Routes>
  );
};

export default AppRoutes;
