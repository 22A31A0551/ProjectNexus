import React, { useState, useEffect, useCallback } from 'react';
import './Manager.css';

const AVATAR_COLORS = [
    'linear-gradient(135deg, #16a34a, #059669)',
    'linear-gradient(135deg, #6366f1, #4338ca)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ef4444, #dc2626)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
];

function getWorkloadLabel(count) {
    if (count <= 2) return { label: 'Low', cls: 'low' };
    if (count <= 5) return { label: 'Medium', cls: 'medium' };
    return { label: 'High', cls: 'high' };
}

function ManagerActiveTickets() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const managerName = user.name || 'Manager';

    const [tickets, setTickets] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignModal, setAssignModal] = useState(null);   // ticket being assigned
    const [selectedDev, setSelectedDev] = useState('');
    const [closeConfirm, setCloseConfirm] = useState(null); // ticket being closed
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchTickets = useCallback(async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/manager/tickets/active?manager=${encodeURIComponent(managerName)}`
            );
            if (res.ok) setTickets(await res.json());
        } catch (err) {
            console.error('Error fetching active tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [managerName]);

    const fetchDevelopers = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:8080/api/manager/developers/workload');
            if (res.ok) setDevelopers(await res.json());
        } catch (err) {
            console.error('Error fetching developers:', err);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
        fetchDevelopers();
    }, [fetchTickets, fetchDevelopers]);

    const handleAssign = async () => {
        if (!selectedDev || !assignModal) return;
        setActionLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/manager/tickets/${assignModal.id}/assign-developer`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ developer: selectedDev }),
                }
            );
            if (res.ok) {
                showToast(`Developer "${selectedDev}" assigned successfully!`);
                setAssignModal(null);
                setSelectedDev('');
                fetchTickets();
                fetchDevelopers();
            }
        } catch (err) {
            showToast('Failed to assign developer.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleClose = async () => {
        if (!closeConfirm) return;
        setActionLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/manager/tickets/${closeConfirm.id}/close`,
                { method: 'PUT' }
            );
            if (res.ok) {
                showToast('Ticket closed successfully!');
                setCloseConfirm(null);
                fetchTickets();
            }
        } catch (err) {
            showToast('Failed to close ticket.', 'error');
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
                    background: toast.type === 'error' ? '#ef4444' : 'var(--mgr-accent)',
                    color: '#fff', padding: '12px 20px', borderRadius: 10,
                    fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    animation: 'slideUp 0.2s ease',
                }}>
                    {toast.type === 'error' ? '✗ ' : '✓ '}{toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="mgr-page-header">
                <div>
                    <h1 className="mgr-page-title">Active Tickets</h1>
                    <p className="mgr-page-subtitle">
                        Manage your assigned tickets — assign developers and close resolved tickets.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="mgr-badge active" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                        {tickets.length} Active
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="mgr-card">
                {loading ? (
                    <div className="mgr-loading" style={{ padding: '40px 0' }}>
                        <div className="mgr-spinner" /><span>Loading tickets…</span>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="mgr-empty">
                        <span className="mgr-empty-icon">🎉</span>
                        <div className="mgr-empty-title">No active tickets</div>
                        <p className="mgr-empty-text">All clear! Active tickets assigned to you will appear here.</p>
                    </div>
                ) : (
                    <div className="mgr-table-wrap">
                        <table className="mgr-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Request Type</th>
                                    <th>Client</th>
                                    <th>Project</th>
                                    <th>Submitted</th>
                                    <th>Developer</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket, i) => (
                                    <tr key={ticket.id}>
                                        <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{ticket.id}</td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{ticket.requestType}</div>
                                            <div style={{
                                                fontSize: '0.8rem', color: '#64748b',
                                                marginTop: '4px', lineHeight: '1.4'
                                            }}>
                                                {ticket.description}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{
                                                    width: 30, height: 30, borderRadius: '50%',
                                                    background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                                                }}>
                                                    {(ticket.client?.name || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{ticket.client?.name || '—'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ticket.client?.companyName || '—'}</div>
                                                </div>
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
                                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                            {formatDate(ticket.submittedAt)}
                                        </td>
                                        <td>
                                            {ticket.assignedDeveloper ? (
                                                <span className="mgr-badge assigned">{ticket.assignedDeveloper}</span>
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Not assigned</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    id={`assign-dev-btn-${ticket.id}`}
                                                    className="mgr-btn primary"
                                                    onClick={() => { setAssignModal(ticket); setSelectedDev(ticket.assignedDeveloper || ''); }}
                                                >
                                                    {ticket.assignedDeveloper ? '🔄 Reassign' : '👤 Assign'}
                                                </button>
                                                <button
                                                    id={`close-ticket-btn-${ticket.id}`}
                                                    className="mgr-btn danger"
                                                    onClick={() => setCloseConfirm(ticket)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Assign Developer Modal */}
            {assignModal && (
                <div className="mgr-modal-overlay">
                    <div className="mgr-modal">
                        <h3 className="mgr-modal-title">Assign Developer</h3>
                        <p className="mgr-modal-subtitle">
                            Ticket <strong>#{assignModal.id}</strong> — <strong>{assignModal.requestType}</strong>
                            <br />
                            Client: {assignModal.client?.name} | Project: {assignModal.project?.projectName}
                        </p>

                        <label className="mgr-modal-label">Select Developer (by workload)</label>

                        {/* Developer list with workload */}
                        <div style={{ marginBottom: 20, maxHeight: 280, overflowY: 'auto' }}>
                            {developers.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                                    No developers found.
                                </p>
                            ) : (
                                developers
                                .filter(dev => dev.name && !dev.name.equalsIgnoreCase("Developer") && !dev.name.equalsIgnoreCase("Software Developer"))
                                .map((dev, i) => {
                                    const wl = getWorkloadLabel(dev.activeTickets);
                                    return (
                                        <div
                                            key={dev.id}
                                            id={`dev-option-${dev.id}`}
                                            className={`mgr-dev-option ${selectedDev === dev.name ? 'selected' : ''}`}
                                            onClick={() => setSelectedDev(dev.name)}
                                        >
                                            <div
                                                className="mgr-dev-option-avatar"
                                                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                                            >
                                                {dev.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="mgr-dev-option-name">{dev.name}</div>
                                                <div className="mgr-dev-option-load">
                                                    {dev.activeTickets} active ticket{dev.activeTickets !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                            <span className={`mgr-dev-option-badge ${wl.cls}`}>{wl.label}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="mgr-modal-actions">
                            <button
                                className="mgr-btn ghost"
                                onClick={() => { setAssignModal(null); setSelectedDev(''); }}
                            >
                                Cancel
                            </button>
                            <button
                                id="confirm-assign-btn"
                                className="mgr-btn primary"
                                onClick={handleAssign}
                                disabled={!selectedDev || actionLoading}
                            >
                                {actionLoading ? 'Assigning…' : '✓ Confirm Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Close Confirmation Modal */}
            {closeConfirm && (
                <div className="mgr-modal-overlay">
                    <div className="mgr-modal">
                        <h3 className="mgr-modal-title">Close Ticket?</h3>
                        <p className="mgr-modal-subtitle">
                            Are you sure you want to close ticket <strong>#{closeConfirm.id}</strong> —{' '}
                            <strong>{closeConfirm.requestType}</strong>?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="mgr-modal-actions">
                            <button className="mgr-btn ghost" onClick={() => setCloseConfirm(null)}>
                                Cancel
                            </button>
                            <button
                                id="confirm-close-btn"
                                className="mgr-btn danger"
                                onClick={handleClose}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Closing…' : '✓ Yes, Close Ticket'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagerActiveTickets;
