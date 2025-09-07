// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import Navbar from './components/Navbar'; 
import AdminPanel from './components/AdminPanel';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />{/* We can add a Navbar component here later */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* This is the protected route */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<TodoList />} />
          </Route>

          {/* Admin Route */}
             <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;