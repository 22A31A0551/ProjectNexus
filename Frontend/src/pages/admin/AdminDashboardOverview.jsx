import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminDashboardOverview() {
    const [overviewData, setOverviewData] = useState({
        totalClients: 0,
        activeClients: 0,
        activeRequests: 0,
        totalProjects: 0,
        pendingProjects: 0,
        recentProjects: [],
        recentRequests: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = () => {
        setLoading(true);
        fetch('http://localhost:8080/api/admin/dashboard/overview')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch dashboard data");
                return res.json();
            })
            .then(data => {
                setOverviewData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Unable to load data from server. Please ensure the backend is running.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDashboardData();

        // Listen for the custom event when a request is accepted in the header/notification dropdown
        window.addEventListener('requestAccepted', fetchDashboardData);
        return () => {
            window.removeEventListener('requestAccepted', fetchDashboardData);
        };
    }, []);

    const stats = [
        { 
            label: 'Total Active Clients', 
            value: overviewData.activeClients, 
            svg: (
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" stroke="currentColor" strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m12-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
            )
        },
        { 
            label: 'Active Requests', 
            value: overviewData.activeRequests, 
            svg: (
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            )
        },
        { 
            label: 'Total Projects', 
            value: overviewData.totalProjects, 
            svg: (
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" stroke="currentColor" strokeWidth="2" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            )
        },
        { 
            label: 'Total Pending Projects', 
            value: overviewData.pendingProjects, 
            svg: (
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
            )
        },
    ];

    const statusStyle = (status) => {
        if (status === 'Accepted')  return { background: 'rgba(34,197,94,0.12)',  color: '#16a34a', border: '1px solid #16a34a' };
        if (status === 'Pending')   return { background: 'rgba(234,179,8,0.12)',  color: '#ca8a04', border: '1px solid #ca8a04' };
        if (status === 'Rejected')  return { background: 'rgba(239,68,68,0.12)',  color: '#dc2626', border: '1px solid #dc2626' };
        return { background: 'rgba(100,116,139,0.12)', color: '#475569', border: '1px solid #94a3b8' };
    };

    const typeIcons = {
        'Bug Fix': (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2l1.5 1.5M14.5 3.5L16 2M9 7.5A3 3 0 0 1 15 7.5"/>
                <path d="M6.5 10H4a1 1 0 0 0-1 1v1a4 4 0 0 0 2 3.46M17.5 10H20a1 1 0 0 1 1 1v1a4 4 0 0 1-2 3.46"/>
                <path d="M5 19a7 7 0 0 0 14 0v-7a7 7 0 0 0-14 0v7z"/>
                <line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/>
            </svg>
        ),
        'Feature Enhancement': (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        ),
        'Maintenance': (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>
            </svg>
        ),
        'General Inquiry': (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
        ),
    };
    const defaultTypeIcon = (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
    );

    return (
        <div className="admin-dashboard-overview">
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Dashboard Overview</h2>
                    <p style={{ color: '#475569' }}>Welcome back, Admin. System statistics overview.</p>
                </div>
            </div>

            {error && (
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--admin-border)' }}>
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-card stat-card">
                        <div className="stat-icon-wrapper">
                            {stat.svg}
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">{stat.label}</span>
                            <h3 className="stat-value">
                                {loading ? '...' : stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid-bottom">
                {/* Recent Service & Maintenance Requests */}
                <div className="glass-card table-section">
                    <div className="section-header">
                        <div>
                            <h3 style={{ color: '#1e1b4b', margin: 0, fontSize: '1.25rem' }}>Recent Support Requests</h3>
                            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '4px 0 0' }}>
                                Latest service and maintenance tickets submitted by clients
                            </p>
                        </div>
                        <a href="/admin/requests/active" className="view-all-link">View All</a>
                    </div>

                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Req ID</th>
                                    <th>Type</th>
                                    <th>Client</th>
                                    <th>Project</th>
                                    <th>Submitted</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>Loading...</td></tr>
                                ) : (overviewData.recentRequests || []).length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--admin-text-secondary)' }}>
                                            No service or maintenance requests yet.
                                        </td>
                                    </tr>
                                ) : (
                                    (overviewData.recentRequests || []).map(req => (
                                        <tr key={req.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--admin-accent)' }}>
                                                REQ-{String(req.id).padStart(4, '0')}
                                            </td>
                                            <td>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                                    <span style={{
                                                        width: '24px', height: '24px', background: '#f1f5f9',
                                                        borderRadius: '5px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        color: '#1e1b4b', flexShrink: 0
                                                    }}>
                                                        {typeIcons[req.requestType] || defaultTypeIcon}
                                                    </span>
                                                    <span>{req.requestType}</span>
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--admin-accent)', fontWeight: 500 }}>
                                                {req.client?.name || 'N/A'}
                                            </td>
                                            <td style={{ color: '#1e1b4b' }}>
                                                {req.project?.projectName || 'N/A'}
                                            </td>
                                            <td style={{ color: '#475569', fontSize: '0.85rem' }}>
                                                {req.submittedAt
                                                    ? new Date(req.submittedAt).toLocaleDateString('en-GB', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })
                                                    : 'N/A'}
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '3px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    ...statusStyle(req.status)
                                                }}>
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
        </div>
    );
}

export default AdminDashboardOverview;
