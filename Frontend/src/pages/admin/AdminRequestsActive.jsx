import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminRequestsActive() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchActiveRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/admin/requests/active');
            if (!response.ok) throw new Error('Failed');
            const data = await response.json();
            setRequests(data);
            setError(null);
        } catch (err) {
            setError('Could not load active requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveRequests();
    }, []);

    const statusColor = (status) => {
        if (status === 'Accepted') return 'active';
        if (status === 'Rejected') return 'closed';
        return 'pending';
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Active Requests</h2>
                    <p style={{ color: '#475569' }}>All accepted support requests currently being processed.</p>
                </div>
            </div>

            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ef4444' }}>
                    {error}
                </div>
            )}

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: '#1e1b4b' }}>Accepted Requests ({requests.length})</h3>
                </div>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Client</th>
                                <th>Project</th>
                                <th>Assigned Manager</th>
                                <th>Submitted</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No active requests found.</td></tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--admin-accent)' }}>REQ-{String(req.id).padStart(4,'0')}</td>
                                        <td>{req.requestType}</td>
                                        <td style={{ color: 'var(--admin-accent)' }}>{req.client?.name}</td>
                                        <td>{req.project?.projectName}</td>
                                        <td>
                                            {req.assignedManager ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, color: '#1e1b4b' }}>
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                                    </svg>
                                                    {req.assignedManager}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not assigned</span>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {new Date(req.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                padding: '4px 12px', borderRadius: '20px',
                                                fontSize: '0.78rem', fontWeight: 600,
                                                background: '#1e1b4b', color: '#fff',
                                            }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminRequestsActive;
