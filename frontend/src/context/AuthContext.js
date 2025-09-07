// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        // Here we would normally verify the token with the backend
        // For now, we'll just decode it or assume it's valid
        // A full implementation would make an API call here
        // For simplicity, we'll skip this for now and add it later.
        // For now, if a token exists, we'll assume a user is logged in.
        setUser({ token }); // Placeholder user object
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user object
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Remove user object
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
