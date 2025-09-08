// src/components/Navbar.js

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand"><h1>To-Do App</h1></Link>
      <div className="nav-links">
        {user ? (
          // This block runs ONLY if a user is logged in
          <>
            {/* The check for admin is now safely inside here */}
            {user.isAdmin && <Link to="/admin">Admin Panel</Link>}
            
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          // This block runs ONLY if the user is logged out
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;