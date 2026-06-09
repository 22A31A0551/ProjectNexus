import React, { useState } from 'react';
import './Admin.css';

const MOCK_REVENUE = [
    { id: 1, source: 'E-Commerce Portal - Phase 1', client: 'Pemmada Corp', amount: 125000, date: '2026-05-15', type: 'Project Delivery' },
    { id: 2, source: 'CRM System - Annual Maintenance', client: 'Vamsi Enterprises', amount: 35000, date: '2026-05-22', type: 'Maintenance' },
    { id: 3, source: 'Legacy Migration - Milestone 1', client: 'Pemmada Corp', amount: 80000, date: '2026-06-01', type: 'Project Delivery' },
    { id: 4, source: 'Bug Fix Support Request - VLOG-001', client: 'Vamsi Enterprises', amount: 8000, date: '2026-06-03', type: 'Support' },
    { id: 5, source: 'Mobile App Beta Testing', client: 'Pemmada Corp', amount: 45000, date: '2026-06-05', type: 'Project Delivery' },
];

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
                    <h2>Revenue Management</h2>
                    <p>Track all income streams from project deliveries, maintenance, and support contracts.</p>
                </div>
            </div>

            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>💰</div>
                    <div className="stat-info">
                        <span className="stat-value">₹{total.toLocaleString()}</span>
                        <span className="stat-label">Total Revenue</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(123,97,255,0.15)' }}>📦</div>
                    <div className="stat-info">
                        <span className="stat-value">₹{deliveries.toLocaleString()}</span>
                        <span className="stat-label">Project Deliveries</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)' }}>🔧</div>
                    <div className="stat-info">
                        <span className="stat-value">₹{maintenance.toLocaleString()}</span>
                        <span className="stat-label">Maintenance</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>🎫</div>
                    <div className="stat-info">
                        <span className="stat-value">₹{support.toLocaleString()}</span>
                        <span className="stat-label">Support Contracts</span>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 20px 0' }}>Revenue Records</h3>
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
                            {records.map(r => {
                                const { bg, color } = typeColor(r.type);
                                return (
                                    <tr key={r.id}>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>#{r.id}</td>
                                        <td style={{ fontWeight: 500 }}>{r.source}</td>
                                        <td style={{ color: 'var(--admin-accent)' }}>{r.client}</td>
                                        <td>
                                            <span style={{ background: bg, color, padding: '3px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                {r.type}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>{new Date(r.date).toLocaleDateString()}</td>
                                        <td style={{ fontWeight: 700, color: '#10b981' }}>₹{r.amount.toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminRevenue;
