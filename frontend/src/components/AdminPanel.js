// src/components/AdminPanel.js

import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersRes = await api.get('/api/admin/users');
        setUsers(usersRes.data);

        const logsRes = await api.get('/api/admin/email-logs');
        setEmailLogs(logsRes.data);
      } catch (err) {
        console.error("Error fetching admin data", err);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      <div className="admin-section">
        <h3>App Users ({users.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Is Admin</th>
              <th>Joined On</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h3>Email Logs ({emailLogs.length})</h3>
        <table>
          <thead>
            <tr>
              <th>To</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {emailLogs.map(log => (
              <tr key={log._id}>
                <td>{log.to}</td>
                <td>{log.subject}</td>
                <td className={log.status === 'success' ? 'status-success' : 'status-failure'}>
                  {log.status}
                </td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;