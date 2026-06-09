import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/admin/clients');
            if (!response.ok) {
                throw new Error('Failed to fetch clients');
            }
            const data = await response.json();
            setClients(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Could not load clients. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-clients-page">
            <div className="page-header">
                <div>
                    <h2>Client Management</h2>
                    <p>View and manage all registered clients.</p>
                </div>
                <button className="btn-primary">+ Add New Client</button>
            </div>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ef4444' }}>
                    {error}
                </div>
            )}

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Registered Clients ({clients.length})</h3>
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid var(--admin-border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--admin-text-primary)'
                        }}
                    />
                </div>
                
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Phone</th>
                                <th>Registered Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        Loading clients...
                                    </td>
                                </tr>
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        No clients found.
                                    </td>
                                </tr>
                            ) : (
                                clients.map(client => (
                                    <tr key={client.id}>
                                        <td style={{ fontWeight: 500 }}>CLI-{client.id}</td>
                                        <td>{client.name}</td>
                                        <td style={{ color: 'var(--admin-accent)' }}>{client.email}</td>
                                        <td>{client.companyName || 'N/A'}</td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>{client.phoneNumber || 'N/A'}</td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {client.registeredDate ? new Date(client.registeredDate).toLocaleDateString() : 'N/A'}
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
                                                View
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

export default AdminClients;
