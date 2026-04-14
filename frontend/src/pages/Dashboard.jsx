import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UsersRound, Users, CalendarDays, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { dummyDoctors, dummyPatients, dummyVisits } from '../data/dummyData';

const Dashboard = () => {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, visits: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docs, pats, vists] = await Promise.all([
          api.get('/doctors'),
          api.get('/patients'),
          api.get('/visits')
        ]);
        setStats({
          doctors: docs.data.length,
          patients: pats.data.length,
          visits: vists.data.length
        });
      } catch (error) {
        console.error(error);
        setStats({
          doctors: dummyDoctors.length,
          patients: dummyPatients.length,
          visits: dummyVisits.length
        });
        toast.error('Offline Mode: Stats from dummy data');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon"><UsersRound size={28} /></div>
          <div>
            <p className="text-muted">Total Doctors</p>
            <h3>{stats.doctors}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ color: 'var(--secondary)', background: 'rgba(236, 72, 153, 0.1)' }}>
            <Users size={28} />
          </div>
          <div>
            <p className="text-muted">Total Patients</p>
            <h3>{stats.patients}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
            <CalendarDays size={28} />
          </div>
          <div>
            <p className="text-muted">Total Visits</p>
            <h3>{stats.visits}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
            <Activity size={28} />
          </div>
          <div>
            <p className="text-muted">System Health</p>
            <h3>Stable</h3>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3>Recent Activity</h3>
        <p className="text-muted" style={{ marginTop: '1rem' }}>Latest updates from the clinic management system will appear here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
