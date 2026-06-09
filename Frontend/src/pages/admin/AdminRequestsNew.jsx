import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminRequestsNew() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

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
        try {
            const response = await fetch(`http://localhost:8080/api/admin/requests/${requestId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                // Remove from pending list
                setRequests(requests.filter(r => r.id !== requestId));
                setSelectedRequest(null);
            }
        } catch (err) {
            console.error(`Error updating request ${requestId}:`, err);
            alert("Failed to update request status.");
        }
    };

    return (
        <div className="admin-requests-page">
            <div className="page-header">
                <div>
                    <h2>New Support Requests</h2>
                    <p>Review incoming client requests and view associated project details.</p>
                </div>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ef4444' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: selectedRequest ? '1fr 1fr' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}>
                
                {/* Pending Requests List */}
                <div className="glass-card">
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem' }}>Pending Review ({requests.length})</h3>
                    
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
                                        border: `1px solid ${selectedRequest?.id === req.id ? 'var(--admin-accent)' : 'var(--admin-border)'}`,
                                        background: selectedRequest?.id === req.id ? 'rgba(123, 97, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>{req.requestType}</span>
                                        <span style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
                                            {new Date(req.submittedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 8px 0', color: 'var(--admin-text-secondary)', fontSize: '0.95rem' }}>
                                        From: <span style={{ color: 'var(--admin-accent)' }}>{req.client?.name}</span>
                                    </p>
                                    <p style={{ margin: 0, color: 'var(--admin-text-secondary)', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Request Review</h3>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Request Info */}
                        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--admin-border)' }}>
                            <h4 style={{ color: 'var(--admin-accent)', margin: '0 0 12px 0' }}>Issue Description</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Type</p>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedRequest.requestType}</p>
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Client</p>
                                    <p style={{ margin: 0, fontWeight: 500 }}>{selectedRequest.client?.name} ({selectedRequest.client?.email})</p>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                                <p style={{ margin: 0, lineHeight: '1.5' }}>{selectedRequest.description}</p>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div style={{ marginBottom: '32px' }}>
                            <h4 style={{ color: '#10b981', margin: '0 0 12px 0' }}>Associated Project Details</h4>
                            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Project Name</p>
                                        <p style={{ margin: 0, fontWeight: 500 }}>{selectedRequest.project?.projectName}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Tech Stack</p>
                                        <p style={{ margin: 0, fontWeight: 500 }}>{selectedRequest.project?.technologyStack}</p>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Description</p>
                                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{selectedRequest.project?.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button 
                                onClick={() => handleAction(selectedRequest.id, 'Accepted')}
                                className="btn-primary" 
                                style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                            >
                                Accept Request
                            </button>
                            <button 
                                onClick={() => handleAction(selectedRequest.id, 'Rejected')}
                                className="btn-primary" 
                                style={{ flex: 1, background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}
                            >
                                Reject Request
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminRequestsNew;
