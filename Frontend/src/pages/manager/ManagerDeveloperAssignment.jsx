import React, { useState, useEffect } from 'react';
import './Manager.css';

const AVATAR_COLORS = [
    'linear-gradient(135deg, #6d28d9, #7c3aed)',
    'linear-gradient(135deg, #6366f1, #4338ca)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
    'linear-gradient(135deg, #ec4899, #db2777)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
];

function ManagerDeveloperAssignment() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const managerName = user.name || 'Manager';

    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myActiveTickets, setMyActiveTickets] = useState([]);
    
    // Assign ticket flow states (target developer and selected ticket)
    const [selectedDevForAssign, setSelectedDevForAssign] = useState(null);
    const [selectedTicketToAssign, setSelectedTicketToAssign] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchDevelopers = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/manager/developers/workload');
            if (res.ok) {
                setDevelopers(await res.json());
            }
        } catch (err) {
            console.error('Error fetching developers:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyActiveTickets = async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/manager/tickets/active?manager=${encodeURIComponent(managerName)}`
            );
            if (res.ok) {
                setMyActiveTickets(await res.json());
            }
        } catch (err) {
            console.error('Error fetching active tickets:', err);
        }
    };

    useEffect(() => {
        fetchDevelopers();
        fetchMyActiveTickets();
    }, [managerName]);

    const handleAssignTicket = async () => {
        if (!selectedTicketToAssign || !selectedDevForAssign) return;
        setActionLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/manager/tickets/${selectedTicketToAssign}/assign-developer`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ developer: selectedDevForAssign.name }),
                }
            );
            if (res.ok) {
                showToast(`Successfully assigned ticket to ${selectedDevForAssign.name}!`);
                setShowAssignModal(false);
                setSelectedTicketToAssign('');
                setSelectedDevForAssign(null);
                fetchDevelopers();
                fetchMyActiveTickets();
            } else {
                showToast('Failed to assign ticket.', 'error');
            }
        } catch (err) {
            showToast('Error assigning ticket.', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Calculate workloads and counts
    const totalActive = developers.reduce((sum, d) => sum + (d.activeTickets || 0), 0);
    const availableDevs = developers.filter(d => (d.activeTickets || 0) === 0).length;
    const busyDevs = developers.filter(d => (d.activeTickets || 0) > 0).length;

    // Filter tickets that do not have any developer assigned yet
    const assignableTickets = myActiveTickets.filter(t => !t.assignedDeveloper || t.assignedDeveloper.trim() === '');

    return (
        <div>
            {/* Toast notification */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 70, right: 24, zIndex: 9998,
                    background: toast.type === 'error' ? '#ef4444' : '#6d28d9',
                    color: '#fff', padding: '12px 20px', borderRadius: 10,
                    fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    animation: 'slideUp 0.2s ease',
                }}>
                    {toast.type === 'error' ? '✗ ' : '✓ '}{toast.msg}
                </div>
            )}

            {/* Page Header */}
            <div className="mgr-page-header">
                <div>
                    <h1 className="mgr-page-title">Developer Assignment</h1>
                    <p className="mgr-page-subtitle">
                        Track developer workloads and assign active tickets to team members.
                    </p>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="mgr-stats-grid">
                <div className="mgr-stat-card">
                    <div className="mgr-stat-icon blue">👨‍💻</div>
                    <div>
                        <span className="mgr-stat-value">{developers.length}</span>
                        <span className="mgr-stat-label">Total Developers</span>
                    </div>
                </div>
                <div className="mgr-stat-card">
                    <div className="mgr-stat-icon green">🟢</div>
                    <div>
                        <span className="mgr-stat-value">{availableDevs}</span>
                        <span className="mgr-stat-label">Available (0 tickets)</span>
                    </div>
                </div>
                <div className="mgr-stat-card">
                    <div className="mgr-stat-icon amber">⚡</div>
                    <div>
                        <span className="mgr-stat-value">{busyDevs}</span>
                        <span className="mgr-stat-label">Busy Developers</span>
                    </div>
                </div>
                <div className="mgr-stat-card">
                    <div className="mgr-stat-icon indigo">📋</div>
                    <div>
                        <span className="mgr-stat-value">{totalActive}</span>
                        <span className="mgr-stat-label">Active Assignments</span>
                    </div>
                </div>
            </div>

            {/* Developers Table Card */}
            <div className="mgr-card">
                <h3 className="mgr-card-title">
                    <span className="mgr-card-title-dot" />
                    All Developers & Assigned Tickets
                </h3>
                
                <div className="mgr-table-wrap">
                    <table className="mgr-table">
                        <thead>
                            <tr>
                                <th>Developer</th>
                                <th>Skills</th>
                                <th>Active Tickets</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                                        <div className="mgr-spinner" style={{ margin: '0 auto 12px' }} />
                                        Loading developers...
                                    </td>
                                </tr>
                            ) : developers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                                        No developers found.
                                    </td>
                                </tr>
                            ) : (
                                developers.map((dev, idx) => {
                                    const ticketCount = dev.activeTickets || 0;
                                    const status = ticketCount === 0 ? 'Available' : 'Busy';
                                    
                                    // Get list of active tickets assigned to this developer under this manager
                                    const devAssignedTickets = myActiveTickets.filter(t => t.assignedDeveloper === dev.name);

                                    return (
                                        <tr key={dev.id || idx}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '50%',
                                                        background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700, fontSize: '0.9rem', color: '#fff'
                                                    }}>
                                                        {dev.name ? dev.name.charAt(0).toUpperCase() : 'D'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'var(--mgr-text-primary)' }}>{dev.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {dev.skills ? (
                                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                        {dev.skills.split(',').map((skill, sIdx) => (
                                                            <span key={sIdx} className="mgr-skill-tag" style={{ margin: 0 }}>
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--mgr-text-secondary)', fontSize: '0.8rem' }}>Developer</span>
                                                )}
                                            </td>
                                            <td>
                                                <div>
                                                    <span className={`mgr-badge ${ticketCount > 3 ? 'pending' : 'active'}`}>
                                                        {ticketCount} tickets
                                                    </span>
                                                    {devAssignedTickets.length > 0 && (
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                                                            {devAssignedTickets.map(t => `#${t.id}`).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`mgr-badge ${status === 'Available' ? 'active' : 'pending'}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDevForAssign(dev);
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="mgr-btn ghost"
                                                    style={{
                                                        borderColor: 'var(--mgr-accent)',
                                                        color: 'var(--mgr-accent)'
                                                    }}
                                                >
                                                    Assign Ticket
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Ticket Modal Overlay */}
            {showAssignModal && selectedDevForAssign && (
                <div className="mgr-modal-overlay">
                    <div className="mgr-modal" style={{ maxWidth: '520px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                width: '40px', height: '40px', background: '#23164b',
                                borderRadius: '10px', display: 'flex', alignItems: 'center',
                                justifyContext: 'center', color: '#fff', flexShrink: 0
                            }}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--mgr-text-primary)' }}>Assign Ticket to {selectedDevForAssign.name}</h3>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                                    Select one of your active tickets to assign
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                            {assignableTickets.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                                    <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>No unassigned active tickets.</p>
                                    <p style={{ margin: 0, fontSize: '0.78rem' }}>All your active tickets are currently assigned to this developer.</p>
                                </div>
                            ) : (
                                assignableTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicketToAssign(ticket.id)}
                                        style={{
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            border: `2px solid ${selectedTicketToAssign === ticket.id ? 'var(--mgr-accent)' : '#e2e8f0'}`,
                                            background: selectedTicketToAssign === ticket.id ? 'rgba(109, 40, 217, 0.05)' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{ticket.requestType}</div>
                                        <div style={{ fontSize: '0.82rem', color: '#475569' }}>Project: {ticket.project?.projectName}</div>
                                        {ticket.assignedDeveloper && (
                                            <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '4px' }}>
                                                Currently assigned to: {ticket.assignedDeveloper} (will be reassigned)
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mgr-modal-actions">
                            <button
                                className="mgr-btn ghost"
                                onClick={() => { setShowAssignModal(false); setSelectedTicketToAssign(''); setSelectedDevForAssign(null); }}
                            >
                                Cancel
                            </button>
                            <button
                                className="mgr-btn primary"
                                onClick={handleAssignTicket}
                                disabled={!selectedTicketToAssign || actionLoading}
                            >
                                {actionLoading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManagerDeveloperAssignment;
