import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { dummyVisits, dummyDoctors, dummyPatients, setDummyVisit, delDummyVisit } from '../data/dummyData';

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentVisit, setCurrentVisit] = useState({ patient: '', doctor: '', reason: '', diagnosis: '', prescription: '', status: 'Scheduled' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vistsData, docsData, patsData] = await Promise.all([
        api.get('/visits'),
        api.get('/doctors'),
        api.get('/patients')
      ]);
      setVisits(vistsData.data);
      setDoctors(docsData.data);
      setPatients(patsData.data);
    } catch (error) {
      toast.error('Offline Mode: Using dummy visits');
      setVisits([...dummyVisits]);
      setDoctors([...dummyDoctors]);
      setPatients([...dummyPatients]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentVisit._id) {
        await api.put(`/visits/${currentVisit._id}`, currentVisit);
        toast.success('Visit updated');
      } else {
        await api.post('/visits', currentVisit);
        toast.success('Visit scheduled');
      }
      setShowModal(false);
      setCurrentVisit({ patient: '', doctor: '', reason: '', diagnosis: '', prescription: '', status: 'Scheduled' });
      fetchData();
    } catch (error) {
      toast.success('Visit saved locally (Offline Mode)');
      setDummyVisit(currentVisit);
      setShowModal(false);
      setCurrentVisit({ patient: '', doctor: '', reason: '', diagnosis: '', prescription: '', status: 'Scheduled' });
      fetchData();
    }
  };

  const handleEdit = (v) => {
    setCurrentVisit({ ...v, patient: v.patient._id, doctor: v.doctor._id });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      try {
        await api.delete(`/visits/${id}`);
        toast.success('Visit deleted');
        fetchData();
      } catch (error) {
        toast.success('Visit deleted locally (Offline Mode)');
        delDummyVisit(id);
        fetchData();
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Visits</h1>
        <button className="btn-primary" onClick={() => { setCurrentVisit({ patient: '', doctor: '', reason: '', diagnosis: '', prescription: '', status: 'Scheduled' }); setShowModal(true); }}>
          <Plus size={18} /> New Visit
        </button>
      </div>

      <div className="glass-card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.map(v => (
                <tr key={v._id}>
                  <td><strong>{v.patient?.name}</strong></td>
                  <td>Dr. {v.doctor?.name}</td>
                  <td>{new Date(v.date).toLocaleDateString()}</td>
                  <td>{v.reason}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                      background: v.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      color: v.status === 'Completed' ? 'var(--success)' : 'var(--primary)'
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td className="action-btns">
                    <button className="btn-icon" onClick={() => handleEdit(v)}><Edit size={18} /></button>
                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(v._id)}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {visits.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No visits scheduled</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2>{currentVisit._id ? 'Edit Visit' : 'Schedule Visit'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Patient</label>
                <select value={currentVisit.patient} onChange={(e) => setCurrentVisit({...currentVisit, patient: e.target.value})} required>
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select value={currentVisit.doctor} onChange={(e) => setCurrentVisit({...currentVisit, doctor: e.target.value})} required>
                  <option value="">Select Doctor</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Reason for Visit</label>
                <input type="text" value={currentVisit.reason} onChange={(e) => setCurrentVisit({...currentVisit, reason: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={currentVisit.status} onChange={(e) => setCurrentVisit({...currentVisit, status: e.target.value})}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
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

export default Visits;
