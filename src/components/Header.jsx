import React from 'react';
import { Menu, Search, RefreshCw, Grid, Settings, Bell, User, Sun, Moon } from 'lucide-react';
import './Header.css';

const Header = ({ onMenuToggle, currentTheme, onThemeToggle }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-button menu-btn" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <div className="logo-container">
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" 
            alt="Keep Logo" 
            className="logo-img"
          />
          <span className="logo-text">Keep</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-container">
          <button className="search-btn">
            <Search size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="action-icons">
          <button className="icon-button" onClick={onThemeToggle} title={currentTheme === 'light' ? 'Enable Dark Mode' : 'Enable Light Mode'}>
            {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="icon-button">
            <RefreshCw size={20} />
          </button>
          <button className="icon-button">
            <Grid size={20} />
          </button>
          <button className="icon-button">
            <Settings size={20} />
          </button>
        </div>
        <div className="user-section">
          <button className="icon-button">
            <Bell size={20} />
          </button>
          <div className="avatar">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
