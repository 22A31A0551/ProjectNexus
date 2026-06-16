import React, { useState, useEffect } from 'react';
import '../admin/Admin.css';

function ClientProjects() {
    const clientUser = JSON.parse(localStorage.getItem('clientUser'));
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clientUser) {
            fetch(`http://localhost:8080/api/client/${clientUser.id}/projects`)
                .then(res => res.json())
                .then(data => {
                    setProjects(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching projects:', err);
                    setLoading(false);
                });
        }
    }, []);

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 style={{ color: '#1e1b4b' }}>Your Projects</h2>
                    <p style={{ color: '#475569' }}>A list of all projects registered under your account.</p>
                </div>
            </div>

            {/* Projects Table */}
            <div className="glass-card table-section">
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Tech Stack</th>
                                <th>GitHub Repo</th>
                                <th>Cost ($)</th>
                                <th>Status</th>
                                <th>Delivery Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center' }}>Loading projects...</td></tr>
                            ) : projects.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center' }}>No projects registered yet.</td></tr>
                            ) : (
                                projects.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 500 }}>PRJ-{p.id}</td>
                                        <td>{p.projectName}</td>
                                        <td style={{ color: '#475569' }}>{p.description}</td>
                                        <td style={{ color: '#475569' }}>{p.technologyStack || 'N/A'}</td>
                                        <td style={{ color: 'var(--admin-accent)' }}>
                                            {p.githubUrl ? (
                                                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-accent)', textDecoration: 'underline' }}>
                                                    Repository ↗
                                                </a>
                                            ) : 'N/A'}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>
                                            {p.price ? `$${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'N/A'}
                                        </td>
                                        <td>
                                            <span className={`status-badge-mono ${p.status === 'In Progress' ? 'status-in-progress' : 'status-completed'}`}>
                                                {p.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td style={{ color: '#475569' }}>{p.deliveryDate || 'Not set'}</td>
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

export default ClientProjects;
