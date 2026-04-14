import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { dummyDoctors, setDummyDoctor, delDummyDoctor } from '../data/dummyData';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState({ name: '', specialization: '', email: '', phone: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/doctors?search=${search}`);
      setDoctors(data);
    } catch (error) {
      console.error('Fetch Doctors Error:', error);
      toast.error('Offline Mode: Using dummy doctors');
      const filtered = dummyDoctors.filter(d => (d.name || '').toLowerCase().includes(search.toLowerCase()) || (d.specialization || '').toLowerCase().includes(search.toLowerCase()));
      setDoctors([...filtered]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentDoctor._id) {
        await api.put(`/doctors/${currentDoctor._id}`, currentDoctor);
        toast.success('Doctor updated successfully');
      } else {
        await api.post('/doctors', currentDoctor);
        toast.success('Doctor added successfully');
      }
      setShowModal(false);
      setCurrentDoctor({ name: '', specialization: '', email: '', phone: '' });
      fetchDoctors();
    } catch (error) {
      toast.success('Doctor saved locally (Offline Mode)');
      setDummyDoctor(currentDoctor);
      setShowModal(false);
      setCurrentDoctor({ name: '', specialization: '', email: '', phone: '' });
      fetchDoctors();
    }
  };

  const handleEdit = (doc) => {
    setCurrentDoctor(doc);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/doctors/${id}`);
        toast.success('Doctor deleted');
        fetchDoctors();
      } catch (error) {
        toast.success('Doctor deleted locally (Offline Mode)');
        delDummyDoctor(id);
        fetchDoctors();
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Doctors</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="search-box glass-card">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search doctors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => { setCurrentDoctor({ name: '', specialization: '', email: '', phone: '' }); setShowModal(true); }}>
            <Plus size={18} /> Add Doctor
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doc => (
                <tr key={doc._id}>
                  <td><strong>{doc.name}</strong></td>
                  <td>{doc.specialization}</td>
                  <td>{doc.email}</td>
                  <td>{doc.phone}</td>
                  <td className="action-btns">
                    <button className="btn-icon" onClick={() => handleEdit(doc)}><Edit size={18} /></button>
                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(doc._id)}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No doctors found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>{currentDoctor._id ? 'Edit Doctor' : 'Add New Doctor'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={currentDoctor.name} onChange={(e) => setCurrentDoctor({...currentDoctor, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input type="text" value={currentDoctor.specialization} onChange={(e) => setCurrentDoctor({...currentDoctor, specialization: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={currentDoctor.email} onChange={(e) => setCurrentDoctor({...currentDoctor, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" value={currentDoctor.phone} onChange={(e) => setCurrentDoctor({...currentDoctor, phone: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
