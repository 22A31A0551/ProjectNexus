import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form States
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [technologyStack, setTechnologyStack] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [price, setPrice] = useState('');
    const [assignedManager, setAssignedManager] = useState('');
    const [managers, setManagers] = useState([]);
    const [debugManagers, setDebugManagers] = useState('');

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/admin/projects');
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Could not load projects. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            setDebugManagers('Fetching...');
            const res = await fetch('http://localhost:8080/api/admin/managers');
            if (res.ok) {
                const data = await res.json();
                setManagers(data);
                setDebugManagers('Success. Count: ' + data.length);
            } else {
                setDebugManagers('Fetch failed: ' + res.status);
            }
        } catch (err) {
            console.error('Failed to fetch managers:', err);
            setDebugManagers('Error: ' + err.message);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchManagers();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectName,
                    description,
                    technologyStack,
                    deliveryDate,
                    status: 'Completed',
                    githubUrl,
                    price: price ? parseFloat(price) : null,
                    assignedManager,
                    clientName,
                    clientEmail
                })
            });
            if (response.ok) {
                await fetchProjects(); // Refresh project list to fetch full client object relations
                setIsModalOpen(false);
                setProjectName('');
                setDescription('');
                setTechnologyStack('');
                setDeliveryDate('');
                setClientName('');
                setClientEmail('');
                setGithubUrl('');
                setPrice('');
                setAssignedManager('');
            } else {
                alert('Failed to create project.');
            }
        } catch (err) {
            alert('Error creating project.');
        }
    };

    return (
        <div className="admin-projects-page">
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Project Repository</h2>
                    <p style={{ color: '#475569' }}>Maintain records of all projects developed by the company.</p>
                    <div style={{ background: '#fef3c7', color: '#b45309', padding: '8px', borderRadius: '4px', marginTop: '10px', fontSize: '0.85rem' }}>
                        DEBUG Managers API: {debugManagers} | State count: {managers?.length}
                    </div>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Create Project</button>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ef4444' }}>
                    {error}
                </div>
            )}

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e1b4b' }}>All Projects ({projects.length})</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(109,40,217,0.2)',
                            background: 'rgba(255,255,255,0.8)',
                            color: '#1e1b4b',
                            outline: 'none'
                        }}>
                            <option value="">All Statuses</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Search projects..." 
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid rgba(109,40,217,0.2)',
                                background: 'rgba(255,255,255,0.8)',
                                color: '#1e1b4b',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>
                
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Project ID</th>
                                <th>Name</th>
                                <th>Client</th>
                                <th>Manager</th>
                                <th>Tech Stack</th>
                                <th>GitHub Repo</th>
                                <th>Cost ($)</th>
                                <th>Status</th>
                                <th>Delivery Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                                        Loading projects...
                                    </td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                                        No projects found.
                                    </td>
                                </tr>
                            ) : (
                                projects.map(project => (
                                    <tr key={project.id}>
                                        <td style={{ fontWeight: 500 }}>PRJ-{project.id}</td>
                                        <td>{project.projectName}</td>
                                        <td style={{ color: 'var(--admin-accent)' }}>
                                            {project.client ? project.client.name : 'Unknown'}
                                        </td>
                                        <td style={{ color: '#1e1b4b', fontWeight: 500 }}>
                                            {project.assignedManager || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Unassigned</span>}
                                        </td>
                                        <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
                                            {project.technologyStack || 'N/A'}
                                        </td>
                                        <td style={{ color: 'var(--admin-accent)' }}>
                                            {project.githubUrl ? (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-accent)', textDecoration: 'underline' }}>
                                                    Repository ↗
                                                </a>
                                            ) : 'N/A'}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>
                                            {project.price ? `$${project.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'N/A'}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${project.status === 'In Progress' ? 'pending' : project.status === 'Completed' ? 'active' : 'closed'}`}>
                                                {project.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {project.deliveryDate ? new Date(project.deliveryDate).toLocaleDateString() : 'Not Set'}
                                        </td>
                                        <td>
                                            <button style={{ 
                                                background: 'transparent', 
                                                border: '1px solid var(--admin-accent)', 
                                                color: 'var(--admin-accent)',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                             }}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="monochrome-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="monochrome-modal" style={{ width: '520px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h3>Create New Project</h3>
                        <p>Store successful company completion projects to link with client email addresses.</p>
                        <form onSubmit={handleCreateProject}>
                            <div className="modal-form-group">
                                <label>Project Name</label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={e => setProjectName(e.target.value)}
                                    placeholder="e.g. E-Commerce Platform"
                                    required
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Client Name</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={e => setClientName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Client Email</label>
                                <input
                                    type="email"
                                    value={clientEmail}
                                    onChange={e => setClientEmail(e.target.value)}
                                    placeholder="e.g. client@company.com"
                                    required
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Technology Stack</label>
                                <input
                                    type="text"
                                    value={technologyStack}
                                    onChange={e => setTechnologyStack(e.target.value)}
                                    placeholder="e.g. React, Spring Boot, MySQL"
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Assign Manager (Optional)</label>
                                <select
                                    value={assignedManager}
                                    onChange={e => setAssignedManager(e.target.value)}
                                >
                                    <option value="">-- No Manager Assigned --</option>
                                    {managers.map(m => (
                                        <option key={m.id} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-form-group">
                                <label>Delivery Date</label>
                                <input
                                    type="date"
                                    value={deliveryDate}
                                    onChange={e => setDeliveryDate(e.target.value)}
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>GitHub Repository URL</label>
                                <input
                                    type="url"
                                    value={githubUrl}
                                    onChange={e => setGithubUrl(e.target.value)}
                                    placeholder="e.g. https://github.com/company/project"
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Project Cost ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="e.g. 15000"
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Description</label>
                                <textarea
                                    rows="3"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Describe project details..."
                                    style={{ width: '100%', padding: '10px', border: '1px solid rgba(109,40,217,0.2)', borderRadius: '8px', background: '#f8f7ff', color: '#1e1b4b', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="modal-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="modal-btn-confirm">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProjects;
