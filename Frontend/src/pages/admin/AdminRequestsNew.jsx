import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminRequestsNew() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [selectedManager, setSelectedManager] = useState('');
    const [showManagerModal, setShowManagerModal] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

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

    const handleAction = async (requestId, status) => {
        if (status === 'Accepted') {
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

    const availableManagers = [
        'Ravi Shankar',
        'Priya Patel',
        'Sneha Reddy'
    ];

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
                    <div className="monochrome-modal">
                        <h3>Assign Manager & Accept Ticket</h3>
                        <p>Assigning support request: <strong>{selectedRequest.requestType}</strong> from <strong>{selectedRequest.client?.name}</strong></p>
                        
                        <div className="modal-form-group">
                            <label>Select Available Manager</label>
                            <select 
                                value={selectedManager} 
                                onChange={(e) => setSelectedManager(e.target.value)}
                                required
                            >
                                <option value="">-- Select Manager --</option>
                                {availableManagers.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
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
                            >
                                Assign & Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminRequestsNew;
