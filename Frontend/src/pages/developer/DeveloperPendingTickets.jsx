import React, { useState, useEffect, useCallback } from 'react';
import './Developer.css';

function DeveloperPendingTickets() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const devName = user.name || 'Developer';

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchTickets = useCallback(async () => {
        try {
            const res = await fetch(
                `${window.API_BASE_URL}/api/developer/tickets/pending?developer=${encodeURIComponent(devName)}`
            );
            if (res.ok) setTickets(await res.json());
        } catch (err) {
            console.error('Error fetching pending tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [devName]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleAccept = async (ticketId) => {
        setActionLoading(true);
        try {
            const res = await fetch(
                `${window.API_BASE_URL}/api/developer/tickets/${ticketId}/accept`,
                { method: 'PUT' }
            );
            if (res.ok) {
                showToast('Successfully accepted the project!');
                fetchTickets();
            } else {
                showToast('Failed to accept project.', 'error');
            }
        } catch (err) {
            showToast('Error accepting project.', 'error');
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
                    <h1 className="dev-page-title">Pending Project Assignments</h1>
                    <p className="dev-page-subtitle">
                        Review and accept work assigned to you by managers.
                    </p>
                </div>
                <span className="dev-badge pending" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                    {tickets.length} Pending
                </span>
            </div>

            {/* Table View */}
            <div className="dev-card" style={{ padding: '24px' }}>
                {loading ? (
                    <div className="dev-loading" style={{ padding: '40px 0' }}>
                        <div className="dev-spinner" /><span>Loading assignments…</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="dev-empty">
                        <span className="dev-empty-icon">📤</span>
                        <div className="dev-empty-title">No pending assignments</div>
                        <p className="dev-empty-text">Check back later for new manager assignments.</p>
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
                                                onClick={() => handleAccept(ticket.id)}
                                                disabled={actionLoading}
                                            >
                                                Accept
                                            </button>
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

export default DeveloperPendingTickets;
