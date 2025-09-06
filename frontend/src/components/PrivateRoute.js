// src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    // Optional: show a loading spinner while checking for token
    return <div>Loading...</div>;
  }

  // If there's a token, show the protected content (Outlet)
  // Otherwise, redirect to the login page
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;