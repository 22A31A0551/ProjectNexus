import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminRequestsActive() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActiveRequests();
    }, []);

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
                                <th>Submitted</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No active requests found.</td></tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id}>
                                        <td style={{ fontWeight: 500 }}>REQ-{req.id}</td>
                                        <td>{req.requestType}</td>
                                        <td style={{ color: 'var(--admin-accent)' }}>{req.client?.name}</td>
                                        <td>{req.project?.projectName}</td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {new Date(req.submittedAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${statusColor(req.status)}`}>
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
