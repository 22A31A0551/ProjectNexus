import React, { useState } from 'react';
import './Admin.css';

const MOCK_MANAGERS = [
    { id: 1, name: 'Ravi Shankar', email: 'ravi.shankar@projectnexus.com', department: 'Engineering', activeTickets: 3, status: 'Available' },
    { id: 2, name: 'Priya Patel', email: 'priya.patel@projectnexus.com', department: 'Design', activeTickets: 1, status: 'Available' },
    { id: 3, name: 'Arjun Mehta', email: 'arjun.mehta@projectnexus.com', department: 'Backend', activeTickets: 5, status: 'Busy' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@projectnexus.com', department: 'QA', activeTickets: 0, status: 'Available' },
];

function AdminManagers() {
    const [managers] = useState(MOCK_MANAGERS);

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2>Manager Assignment</h2>
                    <p>View all project managers and their current workload.</p>
                </div>
                <button className="btn-primary">+ Add Manager</button>
            </div>

            {/* Summary Cards */}
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(123,97,255,0.15)' }}>👔</div>
                    <div className="stat-info">
                        <span className="stat-value">{managers.length}</span>
                        <span className="stat-label">Total Managers</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>✅</div>
                    <div className="stat-info">
                        <span className="stat-value">{managers.filter(m => m.status === 'Available').length}</span>
                        <span className="stat-label">Available</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>⚡</div>
                    <div className="stat-info">
                        <span className="stat-value">{managers.filter(m => m.status === 'Busy').length}</span>
                        <span className="stat-label">Busy</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>🎟️</div>
                    <div className="stat-info">
                        <span className="stat-value">{managers.reduce((sum, m) => sum + m.activeTickets, 0)}</span>
                        <span className="stat-label">Active Tickets</span>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 20px 0' }}>All Managers</h3>
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
                            {managers.map(mgr => (
                                <tr key={mgr.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #7b61ff, #5a3ee0)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: '0.9rem'
                                            }}>
                                                {mgr.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{mgr.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{mgr.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{mgr.department}</td>
                                    <td>
                                        <span style={{
                                            background: mgr.activeTickets > 3 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                            color: mgr.activeTickets > 3 ? '#ef4444' : '#10b981',
                                            padding: '2px 10px', borderRadius: '20px', fontWeight: 500
                                        }}>
                                            {mgr.activeTickets} tickets
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${mgr.status === 'Available' ? 'active' : 'pending'}`}>
                                            {mgr.status}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminManagers;
