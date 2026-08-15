import React, { useState, useEffect, useCallback } from 'react';
import './Developer.css';

function DeveloperClosedTickets() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const devName = user.name || 'Developer';

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = useCallback(async () => {
        try {
            const res = await fetch(
                `${window.API_BASE_URL}/api/developer/tickets/closed?developer=${encodeURIComponent(devName)}`
            );
            if (res.ok) setTickets(await res.json());
        } catch (err) {
            console.error('Error fetching closed tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [devName]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    };

    return (
        <div>
            {/* Header */}
            <div className="dev-page-header">
                <div>
                    <h1 className="dev-page-title">Closed Projects</h1>
                    <p className="dev-page-subtitle">
                        A list of all support requests and projects you have successfully completed and closed.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="dev-badge closed" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                        {tickets.length} Closed
                    </span>
                </div>
            </div>

            {/* Table View */}
            <div className="dev-card" style={{ padding: '24px' }}>
                {loading ? (
                    <div className="dev-loading" style={{ padding: '40px 0' }}>
                        <div className="dev-spinner" /><span>Loading closed projects…</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="dev-empty">
                        <span className="dev-empty-icon">📤</span>
                        <div className="dev-empty-title">No closed tickets</div>
                        <p className="dev-empty-text">Completed projects/tickets will show up here.</p>
                    </div>
                ) : (
                    <div className="dev-table-wrap">
                        <table className="dev-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Request Type</th>
                                    <th>Client</th>
                                    <th>Project Name</th>
                                    <th>Description / Issue</th>
                                    <th>Tech Stack</th>
                                    <th>GitHub Repo</th>
                                    <th>Assigned By</th>
                                    <th>Date Closed</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{ticket.id}</td>
                                        <td style={{ fontWeight: 600 }}>{ticket.requestType}</td>
                                        <td>{ticket.client?.name || '—'}</td>
                                        <td style={{ color: '#1e1b4b', fontWeight: 500 }}>{ticket.project?.projectName || '—'}</td>
                                        <td style={{
                                            maxWidth: 220,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            color: '#475569',
                                            fontSize: '0.825rem'
                                        }} title={ticket.description}>
                                            {ticket.description}
                                        </td>
                                        <td style={{ color: 'var(--dev-accent)', fontWeight: 600 }}>
                                            {ticket.project?.technologyStack || '—'}
                                        </td>
                                        <td>
                                            {ticket.project?.githubUrl ? (
                                                <a 
                                                    href={ticket.project.githubUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.8rem' }}
                                                >
                                                    Repository ↗
                                                </a>
                                            ) : '—'}
                                        </td>
                                        <td>{ticket.assignedManager || '—'}</td>
                                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                            {formatDate(ticket.submittedAt)}
                                        </td>
                                        <td>
                                            <span className="dev-badge closed">
                                                ✓ {ticket.status}
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

export default DeveloperClosedTickets;
