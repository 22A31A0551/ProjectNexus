import React, { useState, useEffect } from 'react';
import './Manager.css';

const REQUEST_TYPE_COLORS = {
    'Bug Fix': { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
    'Feature Enhancement': { bg: 'rgba(99,102,241,0.1)', color: '#4338ca' },
    'Maintenance': { bg: 'rgba(245,158,11,0.1)', color: '#b45309' },
    'Support': { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8' },
};

function ManagerPendingTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/manager/tickets/pending');
                if (res.ok) setTickets(await res.json());
            } catch (err) {
                console.error('Error fetching pending tickets:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
        const interval = setInterval(fetchPending, 15000);
        return () => clearInterval(interval);
    }, []);

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    };

    const uniqueTypes = ['All', ...new Set(tickets.map(t => t.requestType).filter(Boolean))];

    const filtered = tickets.filter(t => {
        // Only show pending tickets that are NOT assigned to a developer
        if (t.assignedDeveloper) return false;
        
        const matchType = filterType === 'All' || t.requestType === filterType;
        const matchSearch = !search || [t.requestType, t.client?.name, t.project?.projectName, t.description]
            .some(v => v?.toLowerCase().includes(search.toLowerCase()));
        return matchType && matchSearch;
    });

    return (
        <div>
            {/* Header */}
            <div className="mgr-page-header">
                <div>
                    <h1 className="mgr-page-title">Pending Tickets</h1>
                    <p className="mgr-page-subtitle">
                        Monitor all tickets awaiting admin approval. These are read-only.
                    </p>
                </div>
                <span className="mgr-badge pending" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                    {filtered.length} Pending
                </span>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search by type, client, project…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: 220,
                        padding: '9px 14px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 10,
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.875rem',
                        color: '#0f172a',
                        background: 'rgba(255,255,255,0.85)',
                    }}
                />
                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    style={{
                        padding: '9px 14px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 10,
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.875rem',
                        background: 'rgba(255,255,255,0.85)',
                        cursor: 'pointer',
                    }}
                >
                    {uniqueTypes.map(t => <option key={t}>{t}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="mgr-card">
                {loading ? (
                    <div className="mgr-loading" style={{ padding: '40px 0' }}>
                        <div className="mgr-spinner" /><span>Loading…</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="mgr-empty">
                        <span className="mgr-empty-icon">📭</span>
                        <div className="mgr-empty-title">
                            {tickets.length === 0 ? 'No pending tickets' : 'No results match your filter'}
                        </div>
                        <p className="mgr-empty-text">
                            {tickets.length === 0
                                ? 'All tickets have been reviewed.'
                                : 'Try adjusting your search or filter.'}
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
                                    <th>Submitted</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((ticket) => {
                                    const typeStyle = REQUEST_TYPE_COLORS[ticket.requestType] || {
                                        bg: 'rgba(22,163,74,0.1)', color: '#16a34a'
                                    };
                                    return (
                                        <tr key={ticket.id}>
                                            <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{ticket.id}</td>
                                            <td>
                                                <span style={{
                                                    background: typeStyle.bg,
                                                    color: typeStyle.color,
                                                    padding: '3px 10px',
                                                    borderRadius: 20,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                }}>
                                                    {ticket.requestType}
                                                </span>
                                            </td>
                                            <td style={{
                                                maxWidth: 220,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                color: '#64748b',
                                                fontSize: '0.82rem',
                                            }}>
                                                {ticket.description}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{ticket.client?.name || '—'}</td>
                                            <td style={{ color: '#64748b' }}>{ticket.project?.projectName || '—'}</td>
                                            <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                                {formatDate(ticket.submittedAt)}
                                            </td>
                                            <td>
                                                <span className="mgr-badge pending">⏳ Pending</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}

export default ManagerPendingTickets;
