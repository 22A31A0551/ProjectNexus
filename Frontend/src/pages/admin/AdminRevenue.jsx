import React, { useState } from 'react';
import './Admin.css';

const MOCK_REVENUE = [];

function AdminRevenue() {
    const [records] = useState(MOCK_REVENUE);
    const total = records.reduce((sum, r) => sum + r.amount, 0);
    const deliveries = records.filter(r => r.type === 'Project Delivery').reduce((sum, r) => sum + r.amount, 0);
    const maintenance = records.filter(r => r.type === 'Maintenance').reduce((sum, r) => sum + r.amount, 0);
    const support = records.filter(r => r.type === 'Support').reduce((sum, r) => sum + r.amount, 0);

    const typeColor = (type) => {
        if (type === 'Project Delivery') return { bg: 'rgba(123,97,255,0.1)', color: 'var(--admin-accent)' };
        if (type === 'Maintenance') return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
        return { bg: 'rgba(16,185,129,0.1)', color: '#10b981' };
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Revenue Management</h2>
                    <p style={{ color: '#475569' }}>Track all income streams from project deliveries, maintenance, and support contracts.</p>
                </div>
            </div>

            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="glass-card stat-card">
                    <div className="stat-icon-wrapper">
                        <svg viewBox="0 0 24 24" width="24" height="24"><rect fill="none" stroke="currentColor" strokeWidth="2" x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">₹{total.toLocaleString()}</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon-wrapper">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline fill="none" stroke="currentColor" strokeWidth="2" points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">₹{deliveries.toLocaleString()}</span>
                        <span className="stat-label">Project Deliveries</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon-wrapper">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">₹{maintenance.toLocaleString()}</span>
                        <span className="stat-label">Maintenance</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon-wrapper">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline fill="none" stroke="currentColor" strokeWidth="2" points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline fill="none" stroke="currentColor" strokeWidth="2" points="10 9 9 9 8 9"/></svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-value">₹{support.toLocaleString()}</span>
                        <span className="stat-label">Support Contracts</span>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 20px 0', color: '#1e1b4b' }}>Revenue Records</h3>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Source</th>
                                <th>Client</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#475569' }}>No revenue records available.</td>
                                </tr>
                            ) : (
                                records.map(r => {
                                    const { bg, color } = typeColor(r.type);
                                    return (
                                        <tr key={r.id}>
                                            <td style={{ color: '#475569' }}>#{r.id}</td>
                                            <td style={{ fontWeight: 500, color: '#1e1b4b' }}>{r.source}</td>
                                            <td style={{ color: '#6d28d9' }}>{r.client}</td>
                                            <td>
                                                <span style={{ background: bg, color, padding: '3px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                    {r.type}
                                                </span>
                                            </td>
                                            <td style={{ color: '#475569' }}>{new Date(r.date).toLocaleDateString()}</td>
                                            <td style={{ fontWeight: 700, color: '#10b981' }}>₹{r.amount.toLocaleString()}</td>
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

export default AdminRevenue;
