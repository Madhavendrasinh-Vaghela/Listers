// src/components/TodoList.js

import React, { useState, useEffect } from 'react';
import api from '../api'; // Import our new api instance

const TodoList = () => {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchItems = async () => {
    try {
      const response = await api.get('/items'); // Use api.get
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    try {
      await api.post('/items/add', { text: newItemText });
      setNewItemText('');
      fetchItems(); // Refetch items to see the new one
    } catch (error) {
      console.error('Error adding item', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      fetchItems(); // Refetch
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item._id);
    setEditText(item.text);
  };
  
  const handleUpdateItem = async (id) => {
    if (!editText.trim()) return;
    try {
      await api.put(`/items/update/${id}`, { text: editText });
      setEditingItemId(null);
      setEditText('');
      fetchItems(); // Refetch
    } catch (error) {
      console.error('Error updating item', error);
    }
  };


  return (
    <div className="todo-list">
      <h2>Your To-Do List</h2>
      <form className="add-item-form" onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Add a new item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <ul>
          {items.map(item => (
            <li key={item._id}>
              {editingItemId === item._id ? (
                <>
                  <input
                    type="text"
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className="save-btn" onClick={() => handleUpdateItem(item._id)}>Save</button>
                </>
              ) : (
                <>
                  <span>{item.text}</span>
                  <div className="item-buttons">
                    <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
    </div>
  );
};

export default TodoList;