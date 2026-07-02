import React, { useState, useEffect } from 'react';
import './Manager.css';

const AVATAR_COLORS = [
    'linear-gradient(135deg, #16a34a, #059669)',
    'linear-gradient(135deg, #6366f1, #4338ca)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ef4444, #dc2626)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
];

function ManagerOverview() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const managerName = user.name || 'Manager';

    const [data, setData] = useState({
        activeCount: 0,
        pendingCount: 0,
        closedCount: 0,
        developerCount: 0,
        recentActiveTickets: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/manager/overview?manager=${encodeURIComponent(managerName)}`
                );
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (err) {
                console.error('Failed to load overview:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [managerName]);

    const stats = [
        { label: 'Active Tickets', value: data.activeCount, icon: '🟢', cls: 'green', desc: 'Assigned & in progress' },
        { label: 'Pending Tickets', value: data.pendingCount, icon: '⏳', cls: 'amber', desc: 'Waiting for review' },
        { label: 'Closed Tickets', value: data.closedCount, icon: '✅', cls: 'indigo', desc: 'Resolved by your team' },
        { label: 'Developers', value: data.developerCount, icon: '👨‍💻', cls: 'blue', desc: 'Available in the team' },
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
            <div className="mgr-loading">
                <div className="mgr-spinner" />
                <span>Loading dashboard…</span>
            </div>
        );
    }

    return (
        <div>
            {/* Page header */}
            <div className="mgr-page-header">
                <div>
                    <h1 className="mgr-page-title">Welcome back, {managerName} 👋</h1>
                    <p className="mgr-page-subtitle">
                        Here's your team's current status at a glance.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="mgr-stats-grid">
                {stats.map((s, i) => (
                    <div className="mgr-stat-card" key={i}>
                        <div className={`mgr-stat-icon ${s.cls}`}>{s.icon}</div>
                        <div>
                            <span className="mgr-stat-value">{s.value}</span>
                            <span className="mgr-stat-label">{s.label}</span>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: 2 }}>
                                {s.desc}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent active tickets */}
            <div className="mgr-card">
                <h2 className="mgr-card-title">
                    <span className="mgr-card-title-dot" />
                    Recent Active Tickets
                </h2>
                {data.recentActiveTickets.length === 0 ? (
                    <div className="mgr-empty">
                        <span className="mgr-empty-icon">📋</span>
                        <div className="mgr-empty-title">No active tickets</div>
                        <p className="mgr-empty-text">Your active tickets will appear here once assigned.</p>
                    </div>
                ) : (
                    <div className="mgr-table-wrap">
                        <table className="mgr-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Type</th>
                                    <th>Client</th>
                                    <th>Project</th>
                                    <th>Developer</th>
                                    <th>Submitted</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentActiveTickets.map((ticket, i) => (
                                    <tr key={ticket.id}>
                                        <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{ticket.id}</td>
                                        <td style={{ fontWeight: 600 }}>{ticket.requestType}</td>
                                        <td>{ticket.client?.name || '—'}</td>
                                        <td style={{ color: '#64748b' }}>{ticket.project?.projectName || '—'}</td>
                                        <td>
                                            {ticket.assignedDeveloper ? (
                                                <span className="mgr-badge assigned">
                                                    {ticket.assignedDeveloper}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Unassigned</span>
                                            )}
                                        </td>
                                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                            {formatDate(ticket.submittedAt)}
                                        </td>
                                        <td>
                                            <span className={`mgr-badge ${getStatusBadge(ticket.status)}`}>
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

export default ManagerOverview;
