import React, { useState, useEffect } from 'react';
import '../admin/Admin.css';

// Shared monochrome SVG icons
const Icons = {
    BugFix: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2l1.5 1.5M14.5 3.5L16 2M9 7.5A3 3 0 0 1 15 7.5"/>
            <path d="M6.5 10H4a1 1 0 0 0-1 1v1a4 4 0 0 0 2 3.46M17.5 10H20a1 1 0 0 1 1 1v1a4 4 0 0 1-2 3.46"/>
            <path d="M5 19a7 7 0 0 0 14 0v-7a7 7 0 0 0-14 0v7z"/>
            <line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/>
        </svg>
    ),
    Feature: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    ),
    Maintenance: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>
        </svg>
    ),
    General: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    ),
    CheckCircle: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    ),
    Clock: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
    ),
    User: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    ),
};

const typeIconMap = {
    'Bug Fix':             Icons.BugFix,
    'Feature Enhancement': Icons.Feature,
    'Maintenance':         Icons.Maintenance,
    'General Inquiry':     Icons.General,
};

function ClientSupportActive() {
    const clientUser = JSON.parse(localStorage.getItem('clientUser'));
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clientUser) {
            fetch(`http://localhost:8080/api/client/${clientUser.id}/requests`)
                .then(res => res.json())
                .then(data => {
                    setRequests(data.filter(r => r.status === 'Accepted'));
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching requests:', err);
                    setLoading(false);
                });
        }
    }, []);

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Active Support</h2>
                    <p style={{ color: '#475569' }}>Support tickets that are currently in progress or accepted.</p>
                </div>
                {/* Count badge */}
                {requests.length > 0 && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: '#1e1b4b', color: '#fff',
                        padding: '8px 18px', borderRadius: '8px',
                        fontWeight: 600, fontSize: '0.9rem'
                    }}>
                        <span style={{ color: '#fff' }}>{Icons.CheckCircle}</span>
                        {requests.length} Active
                    </div>
                )}
            </div>

            {/* Active Support Requests Table */}
            <div className="glass-card table-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                    <div style={{
                        width: '36px', height: '36px', background: '#1e1b4b',
                        borderRadius: '8px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff'
                    }}>
                        {Icons.CheckCircle}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '1.05rem' }}>Active Tickets</h3>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Accepted &amp; assigned to a manager</span>
                    </div>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Type</th>
                                <th>Project</th>
                                <th>Description</th>
                                <th>Assigned Manager</th>
                                <th>Submitted</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>Loading active tickets...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                            <div style={{ width: '44px', height: '44px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                {Icons.CheckCircle}
                                            </div>
                                            <span>No active support requests at the moment.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id}>
                                        <td style={{ fontWeight: 700, color: '#1e1b4b' }}>
                                            REQ-{String(req.id).padStart(4, '0')}
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    width: '28px', height: '28px', background: '#f1f5f9',
                                                    borderRadius: '6px', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    color: '#1e1b4b', flexShrink: 0
                                                }}>
                                                    {typeIconMap[req.requestType] || Icons.General}
                                                </span>
                                                <span style={{ fontWeight: 500, color: '#1e1b4b' }}>{req.requestType}</span>
                                            </span>
                                        </td>
                                        <td style={{ color: '#334155' }}>{req.project?.projectName}</td>
                                        <td style={{ color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {req.description}
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155' }}>
                                                {Icons.User}
                                                {req.assignedManager || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Assigning…</span>}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.85rem' }}>
                                                {Icons.Clock}
                                                {new Date(req.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                padding: '4px 12px', borderRadius: '20px',
                                                fontSize: '0.78rem', fontWeight: 600,
                                                background: '#1e1b4b', color: '#fff',
                                            }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                                                Accepted
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

export default ClientSupportActive;
