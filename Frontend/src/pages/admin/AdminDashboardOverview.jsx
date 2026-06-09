import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminDashboardOverview() {
    const [overviewData, setOverviewData] = useState({
        totalClients: 0,
        activeProjects: 0,
        totalProjects: 0,
        recentProjects: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from Spring Boot Backend
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
    }, []);

    const stats = [
        { label: 'Total Clients', value: overviewData.totalClients, icon: '👥', color: '#7b61ff' },
        { label: 'Active Projects', value: overviewData.activeProjects, icon: '📁', color: '#10b981' },
        { label: 'Total Projects', value: overviewData.totalProjects, icon: '🔔', color: '#f59e0b' },
        { label: 'Monthly Revenue', value: 'N/A', icon: '💰', color: '#ec4899' },
    ];

    return (
        <div className="admin-dashboard-overview">
            <div className="page-header">
                <div>
                    <h2>Dashboard Overview</h2>
                    <p>Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <button className="btn-primary">+ Generate Report</button>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ef4444' }}>
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {stats.map((stat, index) => (
                    <div key={index} className="glass-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div className="stat-icon" style={{ 
                            fontSize: '2rem', 
                            background: `${stat.color}20`, 
                            color: stat.color, 
                            width: '60px', 
                            height: '60px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            borderRadius: '16px' 
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.label}</p>
                            <h3 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', color: 'var(--admin-text-primary)' }}>
                                {loading ? '...' : stat.value}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Recent Projects Table */}
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Recent Projects</h3>
                        <a href="/admin/projects" style={{ color: 'var(--admin-accent)', textDecoration: 'none', fontSize: '0.9rem' }}>View All</a>
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
                                                <span className={`status-badge ${project.status === 'In Progress' ? 'pending' : 'active'}`}>
                                                    {project.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--admin-text-secondary)' }}>{project.deliveryDate || 'Not set'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / System Status */}
                <div className="glass-card">
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem' }}>System Status</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: error ? 'var(--admin-danger)' : 'var(--admin-success)' }}></span>
                                <span>Main API Server</span>
                            </div>
                            <span style={{ color: error ? 'var(--admin-danger)' : 'var(--admin-success)', fontWeight: 500 }}>
                                {error ? 'Offline' : 'Online'}
                            </span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: error ? 'var(--admin-danger)' : 'var(--admin-success)' }}></span>
                                <span>Database Services</span>
                            </div>
                            <span style={{ color: error ? 'var(--admin-danger)' : 'var(--admin-success)', fontWeight: 500 }}>
                                {error ? 'Offline' : 'Online'}
                            </span>
                        </div>
                    </div>
                    
                    <button className="btn-primary" style={{ width: '100%', marginTop: '24px', background: 'rgba(255,255,255,0.05)', color: 'var(--admin-text-primary)', boxShadow: 'none', border: '1px solid var(--admin-border)' }}>
                        System Diagnostics
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardOverview;
