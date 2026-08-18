import React, { useState, useEffect, useCallback } from 'react';
import './Developer.css';

function DeveloperActiveTickets() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const devName = user.name || 'Developer';

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolveConfirm, setResolveConfirm] = useState(null); // ticket being resolved
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchTickets = useCallback(async () => {
        try {
            const res = await fetch(
                `${window.API_BASE_URL}/api/developer/tickets/active?developer=${encodeURIComponent(devName)}`
            );
            if (res.ok) setTickets(await res.json());
        } catch (err) {
            console.error('Error fetching active tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [devName]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleResolve = async () => {
        if (!resolveConfirm) return;
        setActionLoading(true);
        try {
            const res = await fetch(
                `${window.API_BASE_URL}/api/developer/tickets/${resolveConfirm.id}/resolve`,
                { method: 'PUT' }
            );
            if (res.ok) {
                showToast('Project/Ticket resolved and closed successfully!');
                setResolveConfirm(null);
                fetchTickets();
            } else {
                showToast('Failed to resolve ticket.', 'error');
            }
        } catch (err) {
            showToast('Failed to resolve ticket.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    };

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 70, right: 24, zIndex: 9998,
                    background: toast.type === 'error' ? '#ef4444' : 'var(--dev-accent)',
                    color: '#fff', padding: '12px 20px', borderRadius: 10,
                    fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    animation: 'slideUp 0.2s ease',
                }}>
                    {toast.type === 'error' ? '✗ ' : '✓ '}{toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="dev-page-header">
                <div>
                    <h1 className="dev-page-title">Active Projects</h1>
                    <p className="dev-page-subtitle">
                        Your currently active tickets and projects in progress.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="dev-badge active" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                        {tickets.length} Active
                    </span>
                </div>
            </div>

            {/* Table View */}
            <div className="dev-card" style={{ padding: '24px' }}>
                {loading ? (
                    <div className="dev-loading" style={{ padding: '40px 0' }}>
                        <div className="dev-spinner" /><span>Loading active projects…</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="dev-empty">
                        <span className="dev-empty-icon">🎉</span>
                        <div className="dev-empty-title">All clean!</div>
                        <p className="dev-empty-text">No active tickets assigned to you right now.</p>
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
                                    <th>Date Assigned</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
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
                                        <td style={{ textAlign: 'right' }}>
                                            <button 
                                                className="dev-btn primary"
                                                style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                                                onClick={() => setResolveConfirm(ticket)}
                                            >
                                                Close Ticket
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Resolve Confirmation Modal */}
            {resolveConfirm && (
                <div className="mgr-modal-overlay">
                    <div className="mgr-modal">
                        <h3 className="mgr-modal-title">Close Ticket</h3>
                        <p className="mgr-modal-subtitle">
                            Are you sure you want to close ticket <strong>#{resolveConfirm.id}</strong> ("{resolveConfirm.requestType}") after completion of work?
                        </p>
                        <div className="mgr-modal-actions">
                            <button
                                className="dev-btn"
                                style={{ background: 'transparent', color: '#475569', border: '1px solid rgba(0,0,0,0.1)' }}
                                onClick={() => setResolveConfirm(null)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="dev-btn primary"
                                onClick={handleResolve}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Closing...' : 'Yes, Close Ticket'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeveloperActiveTickets;
