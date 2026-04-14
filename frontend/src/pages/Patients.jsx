import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { dummyPatients, setDummyPatient, delDummyPatient } from '../data/dummyData';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({ name: '', age: '', gender: 'Male', email: '', phone: '', address: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/patients?search=${search}`);
      setPatients(data);
    } catch (error) {
      console.error('Fetch Patients Error:', error);
      toast.error('Offline Mode: Using dummy patients');
      const filtered = dummyPatients.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.email || '').toLowerCase().includes(search.toLowerCase()));
      setPatients([...filtered]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPatient._id) {
        await api.put(`/patients/${currentPatient._id}`, currentPatient);
        toast.success('Patient updated');
      } else {
        await api.post('/patients', currentPatient);
        toast.success('Patient added');
      }
      setShowModal(false);
      setCurrentPatient({ name: '', age: '', gender: 'Male', email: '', phone: '', address: '' });
      fetchPatients();
    } catch (error) {
      toast.success('Patient saved locally (Offline Mode)');
      setDummyPatient(currentPatient);
      setShowModal(false);
      setCurrentPatient({ name: '', age: '', gender: 'Male', email: '', phone: '', address: '' });
      fetchPatients();
    }
  };

  const handleEdit = (p) => {
    setCurrentPatient(p);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await api.delete(`/patients/${id}`);
        toast.success('Patient deleted');
        fetchPatients();
      } catch (error) {
        toast.success('Patient deleted locally (Offline Mode)');
        delDummyPatient(id);
        fetchPatients();
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Patients</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="search-box glass-card">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => { setCurrentPatient({ name: '', age: '', gender: 'Male', email: '', phone: '', address: '' }); setShowModal(true); }}>
            <Plus size={18} /> Add Patient
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
                <th>Age</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p._id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td className="action-btns">
                    <button className="btn-icon" onClick={() => handleEdit(p)}><Edit size={18} /></button>
                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p._id)}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>{currentPatient._id ? 'Edit Patient' : 'Add New Patient'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" value={currentPatient.name} onChange={(e) => setCurrentPatient({...currentPatient, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" value={currentPatient.age} onChange={(e) => setCurrentPatient({...currentPatient, age: e.target.value})} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={currentPatient.gender} onChange={(e) => setCurrentPatient({...currentPatient, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" value={currentPatient.phone} onChange={(e) => setCurrentPatient({...currentPatient, phone: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={currentPatient.email} onChange={(e) => setCurrentPatient({...currentPatient, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea 
                  style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '0.75rem', background: 'var(--surface)', color: 'var(--text-main)', minHeight: '80px' }}
                  value={currentPatient.address} 
                  onChange={(e) => setCurrentPatient({...currentPatient, address: e.target.value})}
                />
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

export default Patients;
