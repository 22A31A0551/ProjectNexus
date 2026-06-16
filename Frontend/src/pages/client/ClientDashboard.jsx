import React, { useState, useEffect } from 'react';
import '../admin/Admin.css';

function ClientDashboard() {
    const clientUser = JSON.parse(localStorage.getItem('clientUser'));
    const [projects, setProjects] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clientUser) fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [projectsRes, requestsRes] = await Promise.all([
                fetch(`http://localhost:8080/api/client/${clientUser.id}/projects`),
                fetch(`http://localhost:8080/api/client/${clientUser.id}/requests`)
            ]);
            setProjects(await projectsRes.json());
            setRequests(await requestsRes.json());
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            label: 'Your Projects',
            value: projects.length,
            svg: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        },
        {
            label: 'Pending Requests',
            value: requests.filter(r => r.status === 'Pending').length,
            svg: <svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
        },
        {
            label: 'Accepted Requests',
            value: requests.filter(r => r.status === 'Accepted').length,
            svg: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        },
        {
            label: 'Total Requests',
            value: requests.length,
            svg: <svg viewBox="0 0 24 24" width="24" height="24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m12-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
        }
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Welcome back, {clientUser.name}</h2>
                    <p style={{ color: '#475569' }}>Manage your active projects and support requests below.</p>
                </div>
            </div>

            {/* Accepted Request Notifications */}
            {requests.filter(r => r.status === 'Accepted').map(req => (
                <div key={req.id} className="glass-card" style={{ marginBottom: '16px', borderLeft: '3px solid #1e1b4b', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    {/* Checkmark icon box */}
                    <div style={{
                        width: '36px', height: '36px', flexShrink: 0,
                        background: '#1e1b4b', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                    }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <div>
                        <strong style={{ color: '#1e1b4b', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Ticket Accepted</strong>
                        <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '0.9rem' }}>
                            Your request <strong>"{req.requestType}"</strong> for <strong>"{req.project?.projectName}"</strong> was accepted.
                            {req.assignedManager && <span> Assigned Manager: <strong>{req.assignedManager}</strong></span>}
                        </p>
                    </div>
                </div>
            ))}

            {/* Stats Grid — same as AdminDashboardOverview */}
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card stat-card">
                        <div className="stat-icon-wrapper">{stat.svg}</div>
                        <div className="stat-details">
                            <span className="stat-label">{stat.label}</span>
                            <h3 className="stat-value">{loading ? '...' : stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClientDashboard;
