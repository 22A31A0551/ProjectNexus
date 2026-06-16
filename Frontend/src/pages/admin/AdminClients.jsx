import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

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

    const filtered = clients.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phoneNumber?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-clients-page">
            <div className="page-header">
                <div>
                    <h2>Client Management</h2>
                    <p>All clients who have registered through the portal are listed here automatically.</p>
                </div>
            </div>

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    border: '1px solid #ef4444'
                }}>
                    {error}
                </div>
            )}

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e1b4b' }}>
                        Registered Clients ({filtered.length})
                    </h3>
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid rgba(109,40,217,0.2)',
                            background: 'rgba(255,255,255,0.8)',
                            color: '#1e1b4b',
                            outline: 'none',
                            width: '260px'
                        }}
                    />
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Client ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Registered Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        Loading clients...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                                        {search ? 'No clients match your search.' : 'No registered clients yet.'}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(client => (
                                    <tr key={client.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--admin-accent)' }}>
                                            CLI-{String(client.id).padStart(4, '0')}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{client.name}</td>
                                        <td style={{ color: 'var(--admin-accent)' }}>{client.email}</td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {client.phoneNumber || 'N/A'}
                                        </td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {client.registeredDate
                                                ? new Date(client.registeredDate).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <button style={{
                                                background: 'linear-gradient(135deg, rgba(109,40,217,0.1), rgba(139,92,246,0.15))',
                                                border: '1px solid var(--admin-accent)',
                                                color: 'var(--admin-accent)',
                                                padding: '5px 14px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                                transition: 'all 0.2s'
                                            }}
                                                onMouseEnter={e => {
                                                    e.target.style.background = 'var(--admin-accent)';
                                                    e.target.style.color = '#fff';
                                                }}
                                                onMouseLeave={e => {
                                                    e.target.style.background = 'linear-gradient(135deg, rgba(109,40,217,0.1), rgba(139,92,246,0.15))';
                                                    e.target.style.color = 'var(--admin-accent)';
                                                }}
                                            >
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
