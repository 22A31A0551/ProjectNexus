import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminHistory() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/requests/history');
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (err) {
            console.error('History fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2>Closed Ticket History</h2>
                    <p>Complete log of all resolved and rejected support requests.</p>
                </div>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>All Closed Tickets ({requests.length})</h3>
                    <input
                        type="text"
                        placeholder="Search history..."
                        style={{
                            padding: '8px 16px', borderRadius: '20px',
                            border: '1px solid var(--admin-border)', background: 'rgba(0,0,0,0.2)',
                            color: 'var(--admin-text-primary)'
                        }}
                    />
                </div>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Type</th>
                                <th>Client</th>
                                <th>Project</th>
                                <th>Submitted</th>
                                <th>Final Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                                        No closed tickets yet. Accepted or Rejected requests will appear here.
                                    </td>
                                </tr>
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
                                            <span className={`status-badge ${req.status === 'Accepted' ? 'active' : 'closed'}`}>
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

export default AdminHistory;
