import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Toaster } from 'react-hot-toast';

import Dashboard from './pages/Dashboard.jsx';
import Doctors from './pages/Doctors.jsx';
import Patients from './pages/Patients.jsx';
import Visits from './pages/Visits.jsx';
import Login from './pages/Login.jsx';

import './styles/layout.css';

const AppLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">
      <div className="page-transition-wrapper">
        {children}
      </div>
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--surface)',
            backdropFilter: 'blur(16px)',
            color: 'var(--text-main)',
            border: '1px solid var(--border)',
            padding: '16px',
            borderRadius: '16px',
            boxShadow: 'var(--shadow)'
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--danger)',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Application Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/doctors" element={<AppLayout><Doctors /></AppLayout>} />
            <Route path="/patients" element={<AppLayout><Patients /></AppLayout>} />
            <Route path="/visits" element={<AppLayout><Visits /></AppLayout>} />
          </Route>

          {/* Catch-all Route for 404 / Invalid URL handling */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
