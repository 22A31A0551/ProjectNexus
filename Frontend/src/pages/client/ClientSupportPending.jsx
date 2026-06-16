import React, { useState, useEffect } from 'react';
import '../admin/Admin.css';

// Professional monochrome SVG icons
const Icons = {
    BugFix: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2l1.5 1.5"/>
            <path d="M14.5 3.5L16 2"/>
            <path d="M9 7.5A3 3 0 0 1 15 7.5"/>
            <path d="M6.5 10H4a1 1 0 0 0-1 1v1a4 4 0 0 0 2 3.46"/>
            <path d="M17.5 10H20a1 1 0 0 1 1 1v1a4 4 0 0 1-2 3.46"/>
            <path d="M5 19a7 7 0 0 0 14 0v-7a7 7 0 0 0-14 0v7z"/>
            <line x1="12" y1="12" x2="12" y2="17"/>
            <line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/>
        </svg>
    ),
    Feature: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    ),
    Maintenance: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>
        </svg>
    ),
    General: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    ),
    Ticket: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
        </svg>
    ),
    Clock: (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
        </svg>
    ),
    Plus: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    ),
};

const typeIconMap = {
    'Bug Fix': Icons.BugFix,
    'Feature Enhancement': Icons.Feature,
    'Maintenance': Icons.Maintenance,
    'General Inquiry': Icons.General,
};

function ClientSupportPending() {
    const clientUser = JSON.parse(localStorage.getItem('clientUser'));
    const [requests, setRequests] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [requestType, setRequestType] = useState('Bug Fix');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (clientUser) fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projectsRes, requestsRes] = await Promise.all([
                fetch(`http://localhost:8080/api/client/${clientUser.id}/projects`),
                fetch(`http://localhost:8080/api/client/${clientUser.id}/requests`)
            ]);
            setProjects(await projectsRes.json());
            const allRequests = await requestsRes.json();
            setRequests(allRequests.filter(r => r.status === 'Pending'));
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('http://localhost:8080/api/client/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: clientUser.id,
                    projectId: selectedProjectId,
                    requestType,
                    description
                })
            });
            if (res.ok) {
                const newReq = await res.json();
                setRequests([newReq, ...requests]);
                setIsModalOpen(false);
                setSelectedProjectId('');
                setDescription('');
                setRequestType('Bug Fix');
            } else {
                alert('Failed to submit request.');
            }
        } catch (err) {
            alert('Error submitting request.');
        } finally {
            setSubmitting(false);
        }
    };

    const cards = [
        { key: 'Bug Fix',             icon: Icons.BugFix,      label: 'Bug Fix',             desc: 'Report a bug in your project' },
        { key: 'Feature Enhancement', icon: Icons.Feature,     label: 'Feature Enhancement', desc: 'Request a new feature or improvement' },
        { key: 'Maintenance',         icon: Icons.Maintenance, label: 'Maintenance',         desc: 'Schedule routine maintenance' },
        { key: 'General Inquiry',     icon: Icons.General,     label: 'General Inquiry',     desc: 'Any other queries or concerns' },
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Raise a Support</h2>
                    <p style={{ color: '#475569' }}>Submit a new support ticket or track your pending requests.</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {Icons.Plus}
                    Raise a Ticket
                </button>
            </div>

            {/* Quick-action cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '16px',
                marginBottom: '28px'
            }}>
                {cards.map(card => (
                    <div
                        key={card.key}
                        className="glass-card"
                        onClick={() => { setRequestType(card.key); setIsModalOpen(true); }}
                        style={{
                            padding: '22px 20px',
                            cursor: 'pointer',
                            transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                            borderLeft: '3px solid #1e1b4b',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            userSelect: 'none'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,27,75,0.12)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        {/* Icon in monochrome box */}
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#1e1b4b',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            marginBottom: '4px',
                            flexShrink: 0
                        }}>
                            {card.icon}
                        </div>
                        <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.95rem' }}>{card.label}</span>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4 }}>{card.desc}</span>
                    </div>
                ))}
            </div>

            {/* Pending Tickets Table */}
            <div className="glass-card table-section">
                <div className="section-header" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Table icon */}
                        <div style={{
                            width: '36px', height: '36px',
                            background: '#1e1b4b',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff'
                        }}>
                            {Icons.Ticket}
                        </div>
                        <div>
                            <h3 style={{ color: '#1e1b4b', margin: 0, fontSize: '1.05rem' }}>
                                Pending Tickets
                            </h3>
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                Awaiting review &amp; assignment
                            </span>
                        </div>
                        {requests.length > 0 && (
                            <span style={{
                                background: '#1e1b4b',
                                color: '#fff',
                                borderRadius: '20px',
                                padding: '2px 12px',
                                fontSize: '0.75rem',
                                fontWeight: 700
                            }}>
                                {requests.length}
                            </span>
                        )}
                    </div>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Type</th>
                                <th>Project</th>
                                <th>Description</th>
                                <th>Submitted On</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>Loading tickets...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                                            <div style={{ width: '44px', height: '44px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                                {Icons.Ticket}
                                            </div>
                                            <span>No pending tickets. Click <strong style={{ color: '#1e1b4b' }}>"Raise a Ticket"</strong> to submit one.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map(req => (
                                    <tr key={req.id}>
                                        <td style={{ fontWeight: 700, color: '#1e1b4b' }}>
                                            REQ-{String(req.id).padStart(4, '0')}
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    width: '28px', height: '28px',
                                                    background: '#f1f5f9',
                                                    borderRadius: '6px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#1e1b4b',
                                                    flexShrink: 0
                                                }}>
                                                    {typeIconMap[req.requestType] || Icons.General}
                                                </span>
                                                <span style={{ fontWeight: 500, color: '#1e1b4b' }}>{req.requestType}</span>
                                            </span>
                                        </td>
                                        <td style={{ color: '#334155' }}>{req.project?.projectName}</td>
                                        <td style={{ color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {req.description}
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', fontSize: '0.85rem' }}>
                                                {Icons.Clock}
                                                {new Date(req.submittedAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                background: '#f8fafc',
                                                color: '#334155',
                                                border: '1px solid #cbd5e1'
                                            }}>
                                                {/* Dot indicator */}
                                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#64748b', display: 'inline-block' }} />
                                                Pending
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Raise a Ticket Modal */}
            {isModalOpen && (
                <div className="monochrome-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="monochrome-modal" onClick={e => e.stopPropagation()}>
                        {/* Modal header with icon */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                background: '#1e1b4b',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', flexShrink: 0
                            }}>
                                {Icons.Ticket}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>Raise a Support Ticket</h3>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                                    Select your project and describe the issue
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitRequest} style={{ marginTop: '16px' }}>
                            <div className="modal-form-group">
                                <label>Select Project</label>
                                <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} required>
                                    <option value="">— Choose a project —</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.projectName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-form-group">
                                <label>Request Type</label>
                                <select value={requestType} onChange={e => setRequestType(e.target.value)} required>
                                    <option value="Bug Fix">Bug Fix</option>
                                    <option value="Feature Enhancement">Feature Enhancement</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                </select>
                            </div>

                            {/* Live icon preview of selected type */}
                            {requestType && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '10px 14px',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    marginBottom: '14px',
                                    color: '#1e1b4b'
                                }}>
                                    <span style={{ color: '#1e1b4b' }}>{typeIconMap[requestType]}</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{requestType} selected</span>
                                </div>
                            )}

                            <div className="modal-form-group">
                                <label>Description</label>
                                <textarea
                                    rows="4"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Describe your issue or requirement in detail..."
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid rgba(109,40,217,0.2)',
                                        borderRadius: '8px',
                                        background: '#f8f7ff',
                                        color: '#1e1b4b',
                                        fontFamily: 'inherit',
                                        fontSize: '0.9rem',
                                        resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="modal-btn-cancel" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="modal-btn-confirm"
                                    disabled={submitting}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                                >
                                    {Icons.Ticket}
                                    {submitting ? 'Submitting…' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClientSupportPending;
