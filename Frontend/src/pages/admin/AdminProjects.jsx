import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter and Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [projectDetails, setProjectDetails] = useState(null);
    
    // Form States
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [technologyStack, setTechnologyStack] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [status, setStatus] = useState('Delivered');
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [price, setPrice] = useState('');
    const [assignedManager, setAssignedManager] = useState('');
    const [managers, setManagers] = useState([]);

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
            const res = await fetch('http://localhost:8080/api/admin/managers');
            if (res.ok) {
                setManagers(await res.json());
            }
        } catch (err) {
            console.error('Failed to fetch managers:', err);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchManagers();
    }, []);

    const resetForm = () => {
        setProjectName('');
        setDescription('');
        setTechnologyStack('');
        setDeliveryDate('');
        setStatus('Completed');
        setClientName('');
        setClientEmail('');
        setGithubUrl('');
        setPrice('');
        setAssignedManager('');
        setSelectedProjectId(null);
        setIsEditMode(false);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        resetForm();
        setIsEditMode(true);
        setSelectedProjectId(project.id);
        setProjectName(project.projectName || '');
        setDescription(project.description || '');
        setTechnologyStack(project.technologyStack || '');
        setDeliveryDate(project.deliveryDate || '');
        setStatus(project.status || 'Delivered');
        setClientName(project.client ? project.client.name : '');
        setClientEmail(project.client ? project.client.email : '');
        setGithubUrl(project.githubUrl || '');
        setPrice(project.price ? project.price.toString() : '');
        setAssignedManager(project.assignedManager || '');
        setIsModalOpen(true);
    };

    const handleSaveProject = async (e) => {
        e.preventDefault();
        const payload = {
            projectName,
            description,
            technologyStack,
            deliveryDate,
            status,
            githubUrl,
            price: price ? parseFloat(price) : null,
            clientName,
            clientEmail
        };

        const url = isEditMode 
            ? `http://localhost:8080/api/admin/projects/${selectedProjectId}` 
            : 'http://localhost:8080/api/admin/projects';
        
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                await fetchProjects();
                setIsModalOpen(false);
                resetForm();
            } else {
                alert(`Failed to ${isEditMode ? 'update' : 'create'} project.`);
            }
        } catch (err) {
            alert(`Error ${isEditMode ? 'updating' : 'creating'} project.`);
        }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
        try {
            const response = await fetch(`http://localhost:8080/api/admin/projects/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await fetchProjects();
            } else {
                alert('Failed to delete project.');
            }
        } catch (err) {
            alert('Error deleting project.');
        }
    };

    const handleViewDetails = (project) => {
        setProjectDetails(project);
        setIsDetailsModalOpen(true);
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = 
            (project.projectName && project.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (project.client && project.client.name && project.client.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = statusFilter === '' || project.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="admin-projects-page">
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Project Repository</h2>
                    <p style={{ color: '#475569' }}>Contains all the projects developed and delivered by the company.</p>
                </div>
                <button className="btn-primary" onClick={openCreateModal}>+ Enter Project Details</button>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ef4444' }}>
                    {error}
                </div>
            )}

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e1b4b' }}>All Projects ({filteredProjects.length})</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select 
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(109,40,217,0.2)',
                                background: 'rgba(255,255,255,0.8)',
                                color: '#1e1b4b',
                                outline: 'none'
                            }}
                        >
                            <option value="">All Statuses</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Search by name or client..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
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
                                <th>Status</th>
                                <th>Cost ($)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        Loading projects...
                                    </td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        No projects found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map(project => (
                                    <tr key={project.id}>
                                        <td style={{ fontWeight: 500 }}>PRJ-{project.id}</td>
                                        <td>{project.projectName}</td>
                                        <td style={{ color: 'var(--admin-accent)' }}>
                                            {project.client ? project.client.name : 'Unknown'}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${project.status === 'In Progress' ? 'pending' : (project.status === 'Completed' || project.status === 'Delivered') ? 'active' : 'closed'}`}>
                                                {project.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 500 }}>
                                            {project.price ? `$${project.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'N/A'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    onClick={() => handleViewDetails(project)}
                                                    style={{ 
                                                        background: 'rgba(109,40,217,0.1)', 
                                                        border: '1px solid rgba(109,40,217,0.3)', 
                                                        color: 'var(--admin-accent)',
                                                        padding: '4px 12px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}>
                                                    Details
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(project)}
                                                    style={{ 
                                                        background: 'transparent', 
                                                        border: '1px solid #475569', 
                                                        color: '#475569',
                                                        padding: '4px 12px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}>
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    style={{ 
                                                        background: 'rgba(239, 68, 68, 0.1)', 
                                                        border: '1px solid rgba(239, 68, 68, 0.3)', 
                                                        color: '#ef4444',
                                                        padding: '4px 12px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Project Modal */}
            {isModalOpen && (
                <div className="monochrome-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="monochrome-modal" style={{ width: '560px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h3>{isEditMode ? 'Edit Project Details' : 'Enter New Project Details'}</h3>
                        <p>{isEditMode ? 'Update project details.' : 'Manually enter details for projects developed and delivered by the company.'}</p>
                        <form onSubmit={handleSaveProject}>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                                        required={!isEditMode}
                                        disabled={isEditMode}
                                        title={isEditMode ? "Cannot change client email after creation" : ""}
                                    />
                                </div>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="modal-form-group">
                                    <label>Status</label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        required
                                    >
                                        <option value="Delivered">Delivered</option>
                                        <option value="Completed">Completed</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Pending">Pending</option>
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
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                                    <label>GitHub Repository URL</label>
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={e => setGithubUrl(e.target.value)}
                                        placeholder="e.g. https://github.com/company/project"
                                    />
                                </div>
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
                                <button type="submit" className="modal-btn-confirm">{isEditMode ? 'Save Changes' : 'Save Project Details'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Project Details Modal */}
            {isDetailsModalOpen && projectDetails && (
                <div className="monochrome-modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
                    <div className="monochrome-modal" style={{ width: '600px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: '#1e1b4b' }}>Project Details: PRJ-{projectDetails.id}</h3>
                            <button 
                                onClick={() => setIsDetailsModalOpen(false)}
                                style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#475569' }}
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <strong>Project Name:</strong> <span style={{ color: '#475569' }}>{projectDetails.projectName}</span>
                            </div>
                            <div>
                                <strong>Description:</strong> 
                                <p style={{ color: '#475569', margin: '4px 0 0 0', background: '#f8f7ff', padding: '8px', borderRadius: '4px' }}>
                                    {projectDetails.description || 'No description provided.'}
                                </p>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <strong>Client:</strong> <span style={{ color: '#475569' }}>{projectDetails.client?.name || 'N/A'}</span>
                                </div>
                                <div>
                                    <strong>Client Email:</strong> <span style={{ color: '#475569' }}>{projectDetails.client?.email || 'N/A'}</span>
                                </div>
                                <div>
                                    <strong>Status:</strong> 
                                    <span className={`status-badge ${projectDetails.status === 'In Progress' ? 'pending' : (projectDetails.status === 'Completed' || projectDetails.status === 'Delivered') ? 'active' : 'closed'}`} style={{ marginLeft: '8px' }}>
                                        {projectDetails.status || 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <strong>Delivery Date:</strong> <span style={{ color: '#475569' }}>{projectDetails.deliveryDate ? new Date(projectDetails.deliveryDate).toLocaleDateString() : 'Not Set'}</span>
                                </div>
                                <div>
                                    <strong>Cost:</strong> <span style={{ color: '#475569' }}>{projectDetails.price ? `$${projectDetails.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'N/A'}</span>
                                </div>
                            </div>

                            <div>
                                <strong>Tech Stack:</strong>
                                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {projectDetails.technologyStack ? (
                                        projectDetails.technologyStack.split(',').map((tech, idx) => (
                                            <span key={idx} style={{ background: 'rgba(109,40,217,0.1)', color: 'var(--admin-accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                                                {tech.trim()}
                                            </span>
                                        ))
                                    ) : <span style={{ color: '#475569' }}>N/A</span>}
                                </div>
                            </div>
                            
                            <div>
                                <strong>GitHub URL:</strong> 
                                {projectDetails.githubUrl ? (
                                    <a href={projectDetails.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'var(--admin-accent)', textDecoration: 'underline', marginTop: '4px' }}>
                                        {projectDetails.githubUrl} ↗
                                    </a>
                                ) : <span style={{ color: '#475569', marginLeft: '8px' }}>N/A</span>}
                            </div>
                        </div>

                        <div className="modal-actions" style={{ marginTop: '24px' }}>
                            <button className="modal-btn-confirm" onClick={() => setIsDetailsModalOpen(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProjects;
