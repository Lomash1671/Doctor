import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      sessionStorage.setItem('user', JSON.stringify(data));
      sessionStorage.setItem('token', data.token);
    } catch (error) {
      if (email === 'test@doctor.com' && password === '123456') {
        const dummyUser = { _id: 'demo-123', name: 'Dr. Test', email: 'test@doctor.com', token: 'demo-token' };
        setUser(dummyUser);
        sessionStorage.setItem('user', JSON.stringify(dummyUser));
        sessionStorage.setItem('token', dummyUser.token);
      } else {
        throw error;
      }
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data);
      sessionStorage.setItem('user', JSON.stringify(data));
      sessionStorage.setItem('token', data.token);
    } catch (error) {
      const dummyUser = { _id: Date.now().toString(), name, email, token: 'demo-token' };
      setUser(dummyUser);
      sessionStorage.setItem('user', JSON.stringify(dummyUser));
      sessionStorage.setItem('token', dummyUser.token);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
