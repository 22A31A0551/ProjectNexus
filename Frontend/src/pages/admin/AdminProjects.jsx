import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

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

    return (
        <div className="admin-projects-page">
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Project Repository</h2>
                    <p style={{ color: '#475569' }}>Maintain records of all projects developed by the company.</p>
                </div>
                <button className="btn-primary">+ Create Project</button>
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
                                <th>Tech Stack</th>
                                <th>Status</th>
                                <th>Delivery Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        Loading projects...
                                    </td>
                                </tr>
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
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
                                        <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem' }}>
                                            {project.technologyStack || 'N/A'}
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
        </div>
    );
}

export default AdminProjects;
