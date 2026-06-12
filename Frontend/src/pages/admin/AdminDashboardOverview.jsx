import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminDashboardOverview() {
    const [overviewData, setOverviewData] = useState({
        totalClients: 0,
        activeClients: 0,
        activeRequests: 0,
        totalProjects: 0,
        pendingProjects: 0,
        recentProjects: []
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
                {/* Recent Projects Table */}
                <div className="glass-card table-section">
                    <div className="section-header">
                        <h3 style={{ color: '#1e1b4b' }}>Recent Project History</h3>
                        <a href="/admin/projects" className="view-all-link">View All</a>
                    </div>
                    
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Project Name</th>
                                    <th>Status</th>
                                    <th>Delivery Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Loading projects...</td></tr>
                                ) : overviewData.recentProjects.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>No projects found in the database.</td></tr>
                                ) : (
                                    overviewData.recentProjects.map(project => (
                                        <tr key={project.id}>
                                            <td style={{ fontWeight: 500 }}>PRJ-{project.id}</td>
                                            <td>{project.projectName}</td>
                                            <td>
                                                <span className={`status-badge-mono ${project.status === 'In Progress' ? 'status-in-progress' : 'status-completed'}`}>
                                                    {project.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={{ color: '#475569' }}>{project.deliveryDate || 'Not set'}</td>
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
