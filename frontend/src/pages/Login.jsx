import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Stethoscope, Lock, Mail, User } from 'lucide-react';
import '../styles/layout.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-card">
        <div className="auth-banner">
          <div className="banner-content">
            <div className="logo-box">
              <Stethoscope size={48} color="white" />
            </div>
            <h2>MedCare Pro</h2>
            <p>Advanced Clinic Management System</p>
          </div>
        </div>
        
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
            <p>{isRegister ? 'Join MedCare today' : 'Please enter your account details'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="input-group">
                <User size={20} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            )}
            <div className="input-group">
              <Mail size={20} className="input-icon" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input 
                type="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary auth-submit">
              {isRegister ? 'Sign Up' : 'Log In'}
            </button>

            {!isRegister && (
              <div className="demo-credentials">
                <span>Demo Access</span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.5rem' }}>
                  <div><strong>Email:</strong> test@doctor.com</div>
                  <div><strong>Password:</strong> 123456</div>
                </div>
              </div>
            )}
            
            <p className="auth-switch">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <span onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Log In' : 'Sign Up'}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
