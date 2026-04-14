import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { LayoutDashboard, Users, UsersRound, CalendarDays, LogOut, Sun, Moon } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar glass-card">
      <div className="logo">
        <h2>MedCare</h2>
      </div>
      <nav>
        <ul>
          <li><Link to="/"><LayoutDashboard size={20} /> Dashboard</Link></li>
          <li><Link to="/doctors"><UsersRound size={20} /> Doctors</Link></li>
          <li><Link to="/patients"><Users size={20} /> Patients</Link></li>
          <li><Link to="/visits"><CalendarDays size={20} /> Visits</Link></li>
        </ul>
      </nav>
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <button onClick={toggleTheme} className="logout-btn" style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />} 
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
