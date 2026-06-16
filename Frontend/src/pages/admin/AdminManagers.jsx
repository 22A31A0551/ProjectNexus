import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminManagers() {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/admin/managers/workload');
            if (res.ok) {
                setManagers(await res.json());
            } else {
                const fallback = await fetch('http://localhost:8080/api/admin/managers');
                if (fallback.ok) {
                    const fbData = await fallback.json();
                    setManagers(fbData.map(m => ({ ...m, activeRequests: 0 })));
                }
            }
        } catch (err) {
            console.error('Failed to fetch managers:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Manager Assignment</h2>
                    <p style={{ color: '#475569' }}>View all project managers and their current workload.</p>
                </div>
                <button className="btn-primary">+ Add Manager</button>
            </div>

            {/* Summary Cards */}
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="glass-card stat-card">
                    <div className="stat-icon-wrapper">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">{managers.length}</span>
                        <span className="stat-label">Total Managers</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon-wrapper">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3"/></svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">{managers.filter(m => m.status === 'Available').length}</span>
                        <span className="stat-label">Available</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon-wrapper">
                        <svg viewBox="0 0 24 24" width="24" height="24"><polygon fill="none" stroke="currentColor" strokeWidth="2" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">{managers.filter(m => m.status === 'Busy').length}</span>
                        <span className="stat-label">Busy</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon-wrapper">
                        <svg viewBox="0 0 24 24" width="24" height="24"><rect fill="none" stroke="currentColor" strokeWidth="2" x="3" y="8" width="18" height="8" rx="2"/><line x1="7" y1="8" x2="7" y2="16"/><line x1="17" y1="8" x2="17" y2="16"/></svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">{managers.reduce((sum, m) => sum + (Number(m.activeRequests) || 0), 0)}</span>
                        <span className="stat-label">Active Tickets</span>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 20px 0', color: '#1e1b4b' }}>All Managers</h3>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Manager</th>
                                <th>Department</th>
                                <th>Active Tickets</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#475569' }}>Loading managers...</td>
                                </tr>
                            ) : managers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#475569' }}>No managers found.</td>
                                </tr>
                            ) : (
                                managers.map(mgr => {
                                    const load = Number(mgr.activeRequests) || 0;
                                    const status = load === 0 ? 'Available' : 'Busy';
                                    return (
                                    <tr key={mgr.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: '0.9rem', color: '#fff'
                                                }}>
                                                    {mgr.name ? mgr.name.charAt(0) : 'M'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{mgr.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>{mgr.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Management</td>
                                        <td>
                                            <span style={{
                                                background: load > 3 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                                color: load > 3 ? '#ef4444' : '#10b981',
                                                padding: '2px 10px', borderRadius: '20px', fontWeight: 500
                                            }}>
                                                {load} tickets
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${status === 'Available' ? 'active' : 'pending'}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>
                                            <button style={{
                                                background: 'transparent', border: '1px solid var(--admin-accent)',
                                                color: 'var(--admin-accent)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer'
                                            }}>
                                                Assign Ticket
                                            </button>
                                        </td>
                                    </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminManagers;
