// src/components/AdminRoute.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check for user and if they are an admin
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;