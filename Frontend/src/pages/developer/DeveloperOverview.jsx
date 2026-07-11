import React, { useState, useEffect } from 'react';
import './Developer.css';

function DeveloperOverview() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const devName = user.name || 'Developer';

    const [data, setData] = useState({
        activeCount: 0,
        pendingCount: 0,
        closedCount: 0,
        recentActiveTickets: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/developer/overview?developer=${encodeURIComponent(devName)}`
                );
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (err) {
                console.error('Failed to load developer overview:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [devName]);

    const stats = [
        { label: 'Active Projects', value: data.activeCount, icon: '🟢', cls: 'green', desc: 'Assigned & In Progress' },
        { label: 'Pending Projects', value: data.pendingCount, icon: '⏳', cls: 'amber', desc: 'Awaiting Review' },
        { label: 'Closed Projects', value: data.closedCount, icon: '✅', cls: 'indigo', desc: 'Completed & Resolved' },
    ];

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    };

    const getStatusBadge = (status) => {
        const map = { Accepted: 'active', Pending: 'pending', Closed: 'closed' };
        return map[status] || 'pending';
    };

    if (loading) {
        return (
            <div className="dev-loading">
                <div className="dev-spinner" />
                <span>Loading overview…</span>
            </div>
        );
    }

    return (
        <div>
            {/* Page header */}
            <div className="dev-page-header">
                <div>
                    <h1 className="dev-page-title">Welcome back, {devName} 👋</h1>
                    <p className="dev-page-subtitle">
                        Here's your projects and tickets status at a glance.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="dev-stats-grid">
                {stats.map((s, i) => (
                    <div className="dev-stat-card" key={i}>
                        <div className={`dev-stat-icon ${s.cls}`}>{s.icon}</div>
                        <div>
                            <span className="dev-stat-value">{s.value}</span>
                            <span className="dev-stat-label">{s.label}</span>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: 2 }}>
                                {s.desc}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent active tickets */}
            <div className="dev-card">
                <h2 className="dev-card-title">
                    <span className="dev-card-title-dot" />
                    Recent Active Projects
                </h2>
                {data.recentActiveTickets.length === 0 ? (
                    <div className="dev-empty">
                        <span className="dev-empty-icon">📋</span>
                        <div className="dev-empty-title">No active projects</div>
                        <p className="dev-empty-text">Your active projects/tickets will appear here once assigned.</p>
                    </div>
                ) : (
                    <div className="dev-table-wrap">
                        <table className="dev-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Type</th>
                                    <th>Client</th>
                                    <th>Project</th>
                                    <th>Assigned Manager</th>
                                    <th>Submitted</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentActiveTickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{ticket.id}</td>
                                        <td style={{ fontWeight: 600 }}>{ticket.requestType}</td>
                                        <td>{ticket.client?.name || '—'}</td>
                                        <td style={{ color: '#64748b' }}>{ticket.project?.projectName || '—'}</td>
                                        <td>{ticket.assignedManager || '—'}</td>
                                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                            {formatDate(ticket.submittedAt)}
                                        </td>
                                        <td>
                                            <span className={`dev-badge ${getStatusBadge(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeveloperOverview;
