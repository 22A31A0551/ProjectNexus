import React, { useState, useEffect } from 'react';
import './Client.css';

function ClientDashboard() {
    const clientUser = JSON.parse(localStorage.getItem('clientUser'));
    const [projects, setProjects] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [requestType, setRequestType] = useState('Bug Fix');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (clientUser) {
            fetchDashboardData();
        }
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [projectsRes, requestsRes] = await Promise.all([
                fetch(`http://localhost:8080/api/client/${clientUser.id}/projects`),
                fetch(`http://localhost:8080/api/client/${clientUser.id}/requests`)
            ]);

            const projectsData = await projectsRes.json();
            const requestsData = await requestsRes.json();

            setProjects(projectsData);
            setRequests(requestsData);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/client/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: clientUser.id,
                    projectId: selectedProjectId,
                    requestType: requestType,
                    description: description
                })
            });

            if (response.ok) {
                const newReq = await response.json();
                setRequests([...requests, newReq]);
                setIsModalOpen(false);
                setSelectedProjectId('');
                setDescription('');
            } else {
                alert("Failed to submit request.");
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting request.");
        }
    };

    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading your dashboard...</p>;
    }

    return (
        <div>
            <div className="client-dashboard-header">
                <h1>Welcome, {clientUser.name}</h1>
                <p>Manage your active projects and support requests below.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="client-section-title">Your Projects</h2>
                <button 
                    className="client-btn-primary" 
                    style={{ width: 'auto', padding: '10px 20px', marginBottom: '16px' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    + Request Support
                </button>
            </div>

            {projects.length === 0 ? (
                <p style={{ color: 'var(--client-text-secondary)' }}>You have no registered projects.</p>
            ) : (
                <div className="project-grid">
                    {projects.map(p => (
                        <div key={p.id} className="project-card">
                            <div className="project-meta">
                                <span style={{ fontWeight: 600 }}>PRJ-{p.id}</span>
                                <span className={`project-status ${p.status === 'Completed' ? 'active' : ''}`}>{p.status}</span>
                            </div>
                            <h3>{p.projectName}</h3>
                            <p>{p.description}</p>
                            
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
                                <strong>Tech Stack:</strong> {p.technologyStack || 'N/A'} <br/>
                                <strong>Delivery Date:</strong> {p.deliveryDate || 'Not set'}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="client-section-title" style={{ marginTop: '40px' }}>Your Support History</h2>
            {requests.length === 0 ? (
                <p style={{ color: 'var(--client-text-secondary)' }}>You haven't submitted any support requests yet.</p>
            ) : (
                <div className="client-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Request Type</th>
                                <th>Project</th>
                                <th>Submitted On</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id}>
                                    <td style={{ fontWeight: 500 }}>{req.requestType}</td>
                                    <td>{req.project?.projectName}</td>
                                    <td style={{ color: 'var(--client-text-secondary)' }}>
                                        {new Date(req.submittedAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500,
                                            background: req.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : req.status === 'Accepted' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                            color: req.status === 'Pending' ? 'var(--client-warning)' : req.status === 'Accepted' ? 'var(--client-success)' : 'var(--client-danger)'
                                        }}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for new request */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Submit Support Request</h3>
                        <form onSubmit={handleSubmitRequest}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Select Project</label>
                            <select 
                                value={selectedProjectId} 
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Choose a project --</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.projectName}</option>
                                ))}
                            </select>

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Request Type</label>
                            <select 
                                value={requestType} 
                                onChange={(e) => setRequestType(e.target.value)}
                                required
                            >
                                <option value="Bug Fix">Bug Fix</option>
                                <option value="Feature Enhancement">Feature Enhancement</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="General Inquiry">General Inquiry</option>
                            </select>

                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Description</label>
                            <textarea 
                                rows="5" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please describe your issue or requirement..."
                                required
                            ></textarea>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="client-btn-primary">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClientDashboard;
