import React, { useState } from 'react';
import './Admin.css';

const MOCK_DEVELOPERS = [
    { id: 1, name: 'Kiran Kumar', email: 'kiran@projectnexus.com', skills: 'React, Node.js', manager: 'Ravi Shankar', currentTask: 'UI Revamp for ERP Module', status: 'Active' },
    { id: 2, name: 'Divya Rao', email: 'divya@projectnexus.com', skills: 'Java, Spring Boot', manager: 'Arjun Mehta', currentTask: 'Payment Gateway Integration', status: 'Active' },
    { id: 3, name: 'Sai Teja', email: 'sai@projectnexus.com', skills: 'Python, ML', manager: 'Priya Patel', currentTask: 'Data Pipeline Optimization', status: 'Active' },
    { id: 4, name: 'Lakshmi Naidu', email: 'lakshmi@projectnexus.com', skills: 'QA, Selenium', manager: 'Sneha Reddy', currentTask: 'Regression Testing Suite', status: 'On Leave' },
    { id: 5, name: 'Venkat Raju', email: 'venkat@projectnexus.com', skills: 'AWS, DevOps', manager: 'Arjun Mehta', currentTask: 'CI/CD Pipeline Setup', status: 'Active' },
];

function AdminDevelopers() {
    const [developers] = useState(MOCK_DEVELOPERS);

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2>Developer Monitoring</h2>
                    <p>Track all developers, their assignments, and current task status.</p>
                </div>
                <button className="btn-primary">+ Add Developer</button>
            </div>

            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(123,97,255,0.15)' }}>👨‍💻</div>
                    <div className="stat-info">
                        <span className="stat-value">{developers.length}</span>
                        <span className="stat-label">Total Developers</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>🟢</div>
                    <div className="stat-info">
                        <span className="stat-value">{developers.filter(d => d.status === 'Active').length}</span>
                        <span className="stat-label">Active</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>🏖️</div>
                    <div className="stat-info">
                        <span className="stat-value">{developers.filter(d => d.status === 'On Leave').length}</span>
                        <span className="stat-label">On Leave</span>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 20px 0' }}>All Developers</h3>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Developer</th>
                                <th>Skills</th>
                                <th>Manager</th>
                                <th>Current Task</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {developers.map(dev => (
                                <tr key={dev.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: '0.9rem'
                                            }}>
                                                {dev.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{dev.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>{dev.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {dev.skills.split(', ').map(s => (
                                                <span key={s} style={{
                                                    background: 'rgba(123,97,255,0.1)', color: 'var(--admin-accent)',
                                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                                }}>{s}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--admin-text-secondary)' }}>{dev.manager}</td>
                                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {dev.currentTask}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${dev.status === 'Active' ? 'active' : 'pending'}`}>
                                            {dev.status}
                                        </span>
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

export default AdminDevelopers;
