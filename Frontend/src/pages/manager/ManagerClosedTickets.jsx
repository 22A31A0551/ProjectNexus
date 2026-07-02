import React, { useState, useEffect } from 'react';
import './Manager.css';

function ManagerClosedTickets() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const managerName = user.name || 'Manager';

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchClosed = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/manager/tickets/closed?manager=${encodeURIComponent(managerName)}`
                );
                if (res.ok) setTickets(await res.json());
            } catch (err) {
                console.error('Error fetching closed tickets:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchClosed();
    }, [managerName]);

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    };

    const filtered = tickets.filter(t => {
        if (!search) return true;
        return [t.requestType, t.client?.name, t.project?.projectName, t.assignedDeveloper]
            .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    });

    return (
        <div>
            {/* Header */}
            <div className="mgr-page-header">
                <div>
                    <h1 className="mgr-page-title">Closed Tickets</h1>
                    <p className="mgr-page-subtitle">
                        Historical record of all tickets resolved by your team.
                    </p>
                </div>
                <span className="mgr-badge closed" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                    {tickets.length} Closed
                </span>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Search closed tickets…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 16px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 10,
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.875rem',
                        background: 'rgba(255,255,255,0.85)',
                        boxSizing: 'border-box',
                    }}
                />
            </div>

            {/* Summary mini-cards */}
            {tickets.length > 0 && (
                <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[...new Map(tickets.map(t => [t.requestType, t])).values()].map(t => {
                        const count = tickets.filter(x => x.requestType === t.requestType).length;
                        return (
                            <div key={t.requestType} style={{
                                background: 'rgba(255,255,255,0.85)',
                                border: '1px solid rgba(99,102,241,0.15)',
                                borderRadius: 12,
                                padding: '10px 18px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                backdropFilter: 'blur(10px)',
                            }}>
                                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#4338ca' }}>{count}</span>
                                <span style={{ fontSize: '0.8rem', color: '#475569' }}>{t.requestType}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Table */}
            <div className="mgr-card">
                {loading ? (
                    <div className="mgr-loading" style={{ padding: '40px 0' }}>
                        <div className="mgr-spinner" /><span>Loading…</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="mgr-empty">
                        <span className="mgr-empty-icon">📁</span>
                        <div className="mgr-empty-title">
                            {tickets.length === 0 ? 'No closed tickets yet' : 'No results found'}
                        </div>
                        <p className="mgr-empty-text">
                            {tickets.length === 0
                                ? 'Closed tickets will appear here once you resolve active ones.'
                                : 'Try a different search term.'}
                        </p>
                    </div>
                ) : (
                    <div className="mgr-table-wrap">
                        <table className="mgr-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Request Type</th>
                                    <th>Description</th>
                                    <th>Client</th>
                                    <th>Project</th>
                                    <th>Developer</th>
                                    <th>Submitted</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{ticket.id}</td>
                                        <td style={{ fontWeight: 600 }}>{ticket.requestType}</td>
                                        <td style={{
                                            color: '#64748b',
                                            fontSize: '0.8rem',
                                            lineHeight: '1.4'
                                        }}>
                                            {ticket.description}
                                        </td>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{ticket.client?.name || '—'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ticket.client?.companyName || '—'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{ticket.project?.projectName || '—'}</div>
                                            {ticket.project?.technologyStack && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--mgr-accent)', fontWeight: 500 }}>
                                                    Tech: {ticket.project.technologyStack}
                                                </div>
                                            )}
                                            {ticket.project?.githubUrl && (
                                                <div style={{ marginTop: '4px' }}>
                                                    <a 
                                                        href={ticket.project.githubUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ fontSize: '0.75rem', color: '#2563eb', textDecoration: 'underline' }}
                                                    >
                                                        GitHub Code ↗
                                                    </a>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {ticket.assignedDeveloper ? (
                                                <span className="mgr-badge assigned">{ticket.assignedDeveloper}</span>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                                            )}
                                        </td>
                                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                            {formatDate(ticket.submittedAt)}
                                        </td>
                                        <td>
                                            <span className="mgr-badge closed">✅ Closed</span>
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

export default ManagerClosedTickets;
