import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminRequestsNew() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState('');
    const [showManagerModal, setShowManagerModal] = useState(false);

    const fetchManagers = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/admin/managers/workload');
            if (res.ok) {
                const data = await res.json();
                console.log('Managers workload loaded:', data);
                setManagers(data);
            } else {
                // Fallback to basic managers list
                const fallback = await fetch('http://localhost:8080/api/admin/managers');
                if (fallback.ok) {
                    const fbData = await fallback.json();
                    // Wrap in workload shape
                    setManagers(fbData.map(m => ({ ...m, activeRequests: 0 })));
                }
            }
        } catch (err) {
            console.error('Failed to fetch managers:', err);
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/admin/requests/pending');
            if (!response.ok) throw new Error('Failed to fetch requests');
            const data = await response.json();
            setRequests(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError('Could not load new requests. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchManagers();
    }, []);

    const handleAction = async (requestId, status) => {
        if (status === 'Accepted') {
            await fetchManagers(); // Fetch fresh workloads right before opening
            setShowManagerModal(true);
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:8080/api/admin/requests/${requestId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                setRequests(requests.filter(r => r.id !== requestId));
                setSelectedRequest(null);
            }
        } catch (err) {
            console.error(`Error updating request ${requestId}:`, err);
            alert("Failed to update request status.");
        }
    };

    const handleConfirmAccept = async () => {
        if (!selectedManager) {
            alert("Please select a manager to assign.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/admin/requests/${selectedRequest.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'Accepted',
                    assignedManager: selectedManager
                })
            });
            if (response.ok) {
                setRequests(requests.filter(r => r.id !== selectedRequest.id));
                setSelectedRequest(null);
                setShowManagerModal(false);
                setSelectedManager('');
            }
        } catch (err) {
            console.error(`Error accepting request:`, err);
            alert("Failed to accept request.");
        }
    };


    return (
        <div className="admin-requests-page">
            <div className="page-header">
                <div>
                    <h2>Pending Support Requests</h2>
                    <p>Review incoming client requests and view associated project details.</p>
                </div>
            </div>

            {error && (
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--admin-border)' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: selectedRequest ? '1fr 1fr' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}>
                
                {/* Pending Requests List */}
                <div className="glass-card">
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: '#1e1b4b' }}>Pending Review ({requests.length})</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loading ? (
                            <p style={{ textAlign: 'center', color: 'var(--admin-text-secondary)' }}>Loading...</p>
                        ) : requests.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--admin-text-secondary)' }}>No new requests at this time.</p>
                        ) : (
                            requests.map(req => (
                                <div 
                                    key={req.id} 
                                    onClick={() => setSelectedRequest(req)}
                                    style={{ 
                                        padding: '16px', 
                                        borderRadius: '8px', 
                                        border: `1px solid ${selectedRequest?.id === req.id ? 'rgba(109,40,217,0.4)' : 'rgba(109,40,217,0.1)'}`,
                                        background: selectedRequest?.id === req.id ? 'rgba(109,40,217,0.05)' : 'rgba(255,255,255,0.6)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{req.requestType}</span>
                                        <span style={{ color: '#475569', fontSize: '0.85rem' }}>
                                            {new Date(req.submittedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '0.95rem' }}>
                                        From: <span style={{ color: '#1e1b4b', fontWeight: 500 }}>{req.client?.name}</span>
                                    </p>
                                    <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        Project: {req.project?.projectName}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Selected Request & Project Details Panel */}
                {selectedRequest && (
                    <div className="glass-card" style={{ animation: 'fadeIn 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1e1b4b' }}>Request Review</h3>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                style={{ background: 'transparent', border: 'none', color: '#475569', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Request Info */}
                        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--admin-border)' }}>
                            <h4 style={{ color: '#1e1b4b', margin: '0 0 12px 0' }}>Issue Description</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#475569' }}>Type</p>
                                    <p style={{ margin: 0, fontWeight: 500, color: '#1e1b4b' }}>{selectedRequest.requestType}</p>
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#475569' }}>Client</p>
                                    <p style={{ margin: 0, fontWeight: 500, color: '#1e1b4b' }}>{selectedRequest.client?.name} ({selectedRequest.client?.email})</p>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.8)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(109,40,217,0.1)' }}>
                                <p style={{ margin: 0, lineHeight: '1.5', color: '#1e1b4b' }}>{selectedRequest.description}</p>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div style={{ marginBottom: '32px' }}>
                            <h4 style={{ color: '#1e1b4b', margin: '0 0 12px 0' }}>Associated Project Details</h4>
                            <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(109,40,217,0.1)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#475569' }}>Project Name</p>
                                        <p style={{ margin: 0, fontWeight: 500, color: '#1e1b4b' }}>{selectedRequest.project?.projectName}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#475569' }}>Tech Stack</p>
                                        <p style={{ margin: 0, fontWeight: 500, color: '#1e1b4b' }}>{selectedRequest.project?.technologyStack}</p>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#475569' }}>Description</p>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e1b4b' }}>{selectedRequest.project?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button 
                                onClick={() => handleAction(selectedRequest.id, 'Accepted')}
                                className="btn-primary" 
                                style={{ flex: 1, background: '#ffffff', color: '#000000', boxShadow: 'none' }}
                            >
                                Accept Request
                            </button>
                            <button 
                                onClick={() => handleAction(selectedRequest.id, 'Rejected')}
                                className="btn-primary" 
                                style={{ flex: 1, background: 'transparent', border: '1px solid var(--admin-danger)', color: 'var(--admin-danger)', boxShadow: 'none' }}
                            >
                                Reject Request
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Manager Assignment Modal Overlay */}
            {showManagerModal && selectedRequest && (
                <div className="monochrome-modal-overlay">
                    <div className="monochrome-modal" style={{ maxWidth: '520px', width: '100%' }}>

                        {/* Modal Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                            <div style={{
                                width: '40px', height: '40px', background: '#1e1b4b',
                                borderRadius: '10px', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: '#fff', flexShrink: 0
                            }}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>Assign Manager & Accept Ticket</h3>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                                    <strong>{selectedRequest.requestType}</strong> from <strong>{selectedRequest.client?.name}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Workload info note */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#f8fafc', border: '1px solid #e2e8f0',
                            borderRadius: '8px', padding: '10px 14px',
                            marginBottom: '16px', marginTop: '12px'
                        }}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <span style={{ fontSize: '0.8rem', color: '#475569' }}>
                                Managers are sorted by <strong>current workload</strong>. Pick the least-loaded one for faster resolution.
                            </span>
                        </div>

                        {/* Manager Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
                            {managers.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                                    <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>No managers found.</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Please ensure the backend is running and managers are seeded.</p>
                                </div>
                            ) : managers.map((m, idx) => {
                                const isSelected = selectedManager === m.name;
                                const isRecommended = idx === 0; // least loaded = first (sorted asc)
                                const load = Number(m.activeRequests);
                                const maxLoad = Math.max(...managers.map(x => Number(x.activeRequests)), 1);
                                const pct = Math.round((load / maxLoad) * 100);
                                const barColor = load === 0 ? '#16a34a' : load <= 2 ? '#ca8a04' : '#dc2626';
                                const loadLabel = load === 0 ? 'Free' : load === 1 ? '1 task' : `${load} tasks`;

                                return (
                                    <div
                                        key={m.id}
                                        onClick={() => setSelectedManager(m.name)}
                                        style={{
                                            padding: '14px 16px',
                                            borderRadius: '10px',
                                            border: `2px solid ${isSelected ? '#1e1b4b' : '#e2e8f0'}`,
                                            background: isSelected ? '#f0f0ff' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.18s',
                                        }}
                                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#94a3b8'; }}
                                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {/* Avatar */}
                                                <div style={{
                                                    width: '34px', height: '34px',
                                                    background: isSelected ? '#1e1b4b' : '#f1f5f9',
                                                    borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: isSelected ? '#fff' : '#475569',
                                                    fontWeight: 700, fontSize: '0.85rem',
                                                    flexShrink: 0,
                                                }}>
                                                    {m.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        {m.name}
                                                        {isRecommended && (
                                                            <span style={{
                                                                background: '#dcfce7', color: '#16a34a',
                                                                border: '1px solid #bbf7d0',
                                                                borderRadius: '20px', padding: '1px 8px',
                                                                fontSize: '0.68rem', fontWeight: 700,
                                                            }}>★ Recommended</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.email}</div>
                                                </div>
                                            </div>
                                            {/* Workload count */}
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '20px',
                                                fontSize: '0.75rem', fontWeight: 700,
                                                background: load === 0 ? '#dcfce7' : load <= 2 ? '#fef9c3' : '#fee2e2',
                                                color: barColor,
                                                border: `1px solid ${barColor}33`,
                                            }}>
                                                {loadLabel}
                                            </span>
                                        </div>

                                        {/* Workload progress bar */}
                                        <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', width: `${pct}%`,
                                                background: barColor,
                                                borderRadius: '4px',
                                                transition: 'width 0.4s ease',
                                                minWidth: load > 0 ? '4px' : '0',
                                            }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-btn-cancel"
                                onClick={() => { setShowManagerModal(false); setSelectedManager(''); }}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-btn-confirm"
                                onClick={handleConfirmAccept}
                                disabled={!selectedManager}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                {selectedManager ? `Assign ${selectedManager} & Accept` : 'Assign & Accept'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminRequestsNew;
