import React from 'react';
import { Lightbulb, Bell, Edit2, Archive, Trash2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, activeTab, setActiveTab, onClose }) => {
  const menuItems = [
    { id: 'notes', label: 'Notes', icon: <Lightbulb size={24} /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell size={24} /> },
    { id: 'labels', label: 'Edit labels', icon: <Edit2 size={24} /> },
    { id: 'archive', label: 'Archive', icon: <Archive size={24} /> },
    { id: 'trash', label: 'Bin', icon: <Trash2 size={24} /> },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <>
      <div 
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <ul className="sidebar-list">
          {menuItems.map((item) => (
            <li key={item.id} className="sidebar-item">
              <button
                className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleTabClick(item.id)}
                title={!isOpen ? item.label : ''}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
