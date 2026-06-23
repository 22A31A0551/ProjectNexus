import React, { useState, useEffect } from 'react';
import './Admin.css';

const statusStyle = (status) => {
    if (status === 'Accepted' || status === 'Completed')
        return { background: 'rgba(34,197,94,0.12)', color: '#16a34a', border: '1px solid #16a34a' };
    if (status === 'Pending' || status === 'In Progress')
        return { background: 'rgba(234,179,8,0.12)', color: '#ca8a04', border: '1px solid #ca8a04' };
    if (status === 'Rejected' || status === 'Closed')
        return { background: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid #dc2626' };
    return { background: 'rgba(100,116,139,0.12)', color: '#475569', border: '1px solid #94a3b8' };
};

function AdminClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    // Client detail modal state
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientDetails, setClientDetails] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/admin/clients');
            if (!response.ok) throw new Error('Failed to fetch clients');
            setClients(await response.json());
            setError(null);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Could not load clients. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewClient = async (client) => {
        setSelectedClient(client);
        setActiveTab('profile');
        setClientDetails(null);
        setDetailLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/admin/clients/${client.id}/details`);
            if (res.ok) setClientDetails(await res.json());
        } catch (err) {
            console.error('Failed to fetch client details:', err);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedClient(null);
        setClientDetails(null);
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
                    background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                    padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #ef4444'
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
                            padding: '8px 16px', borderRadius: '20px',
                            border: '1px solid rgba(109,40,217,0.2)',
                            background: 'rgba(255,255,255,0.8)', color: '#1e1b4b',
                            outline: 'none', width: '260px'
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
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading clients...</td></tr>
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
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                                                }}>
                                                    {client.name?.charAt(0) || 'C'}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{client.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--admin-accent)' }}>{client.email}</td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>{client.phoneNumber || 'N/A'}</td>
                                        <td style={{ color: 'var(--admin-text-secondary)' }}>
                                            {client.registeredDate
                                                ? new Date(client.registeredDate).toLocaleDateString('en-GB', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleViewClient(client)}
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(109,40,217,0.1), rgba(139,92,246,0.15))',
                                                    border: '1px solid var(--admin-accent)',
                                                    color: 'var(--admin-accent)', padding: '5px 14px',
                                                    borderRadius: '6px', cursor: 'pointer',
                                                    fontWeight: 500, transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--admin-accent)'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(109,40,217,0.1), rgba(139,92,246,0.15))'; e.currentTarget.style.color = 'var(--admin-accent)'; }}
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

            {/* Client Detail Modal */}
            {selectedClient && (
                <div className="monochrome-modal-overlay" onClick={closeModal}>
                    <div
                        className="monochrome-modal"
                        style={{ maxWidth: '680px', width: '100%', padding: '0', overflow: 'hidden' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            background: '#23164b',
                            padding: '24px 28px',
                            display: 'flex', alignItems: 'center', gap: '16px'
                        }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 700, flexShrink: 0,
                                color: '#fff'
                            }}>
                                {selectedClient.name?.charAt(0) || 'C'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', textTransform: 'none', fontWeight: 700 }}>{selectedClient.name}</h3>
                                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginBottom: 0 }}>
                                    CLI-{String(selectedClient.id).padStart(4, '0')} · {selectedClient.email}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff', width: '32px', height: '32px',
                                    borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >✕</button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                            {['profile', 'projects', 'requests'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '12px 24px', border: 'none', cursor: 'pointer',
                                        background: 'transparent', fontWeight: 600, fontSize: '0.9rem',
                                        color: activeTab === tab ? '#1e1b4b' : '#64748b',
                                        borderBottom: activeTab === tab ? '2px solid #1e1b4b' : '2px solid transparent',
                                        transition: 'all 0.18s', textTransform: 'capitalize'
                                    }}
                                >
                                    {tab}
                                    {tab === 'projects' && clientDetails && (
                                        <span style={{
                                            marginLeft: '6px', background: '#1e1b4b', color: '#fff',
                                            borderRadius: '20px', padding: '1px 7px', fontSize: '0.72rem'
                                        }}>{clientDetails.projects?.length || 0}</span>
                                    )}
                                    {tab === 'requests' && clientDetails && (
                                        <span style={{
                                            marginLeft: '6px', background: '#6d28d9', color: '#fff',
                                            borderRadius: '20px', padding: '1px 7px', fontSize: '0.72rem'
                                        }}>{clientDetails.requests?.length || 0}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div style={{ padding: '24px 28px', maxHeight: '400px', overflowY: 'auto' }}>
                            {detailLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                    Loading client data...
                                </div>
                            ) : (
                                <>
                                    {/* Profile Tab */}
                                    {activeTab === 'profile' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                            {[
                                                { label: 'Full Name', value: selectedClient.name },
                                                { label: 'Email Address', value: selectedClient.email },
                                                { label: 'Phone Number', value: selectedClient.phoneNumber || 'Not provided' },
                                                { label: 'Company', value: selectedClient.companyName || 'Individual Client' },
                                                {
                                                    label: 'Registered On',
                                                    value: selectedClient.registeredDate
                                                        ? new Date(selectedClient.registeredDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
                                                        : 'N/A'
                                                },
                                                { label: 'Total Projects', value: clientDetails?.projects?.length ?? '…' },
                                                { label: 'Total Requests', value: clientDetails?.requests?.length ?? '…' },
                                                {
                                                    label: 'Active Tickets',
                                                    value: clientDetails?.requests?.filter(r => r.status === 'Accepted').length ?? '…'
                                                },
                                            ].map(({ label, value }) => (
                                                <div key={label} style={{
                                                    background: '#f8fafc', borderRadius: '10px',
                                                    padding: '14px 16px', border: '1px solid #e2e8f0'
                                                }}>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                                                    <div style={{ fontWeight: 600, color: '#1e1b4b', fontSize: '0.95rem' }}>{value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Projects Tab */}
                                    {activeTab === 'projects' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {!clientDetails?.projects?.length ? (
                                                <p style={{ textAlign: 'center', color: '#64748b', padding: '32px 0' }}>No projects found for this client.</p>
                                            ) : clientDetails.projects.map(proj => (
                                                <div key={proj.id} style={{
                                                    background: '#f8fafc', borderRadius: '10px',
                                                    padding: '14px 16px', border: '1px solid #e2e8f0',
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                                }}>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: '4px' }}>{proj.projectName}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{proj.technologyStack || 'N/A'}</div>
                                                    </div>
                                                    <span style={{
                                                        padding: '3px 12px', borderRadius: '20px',
                                                        fontSize: '0.78rem', fontWeight: 600,
                                                        ...statusStyle(proj.status)
                                                    }}>{proj.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Requests Tab */}
                                    {activeTab === 'requests' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {!clientDetails?.requests?.length ? (
                                                <p style={{ textAlign: 'center', color: '#64748b', padding: '32px 0' }}>No support requests found for this client.</p>
                                            ) : clientDetails.requests.map(req => (
                                                <div key={req.id} style={{
                                                    background: '#f8fafc', borderRadius: '10px',
                                                    padding: '14px 16px', border: '1px solid #e2e8f0',
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                        <span style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.82rem' }}>
                                                            REQ-{String(req.id).padStart(4, '0')}
                                                        </span>
                                                        <span style={{
                                                            padding: '2px 10px', borderRadius: '20px',
                                                            fontSize: '0.75rem', fontWeight: 600,
                                                            ...statusStyle(req.status)
                                                        }}>{req.status}</span>
                                                    </div>
                                                    <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: '2px' }}>{req.requestType}</div>
                                                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                                        {req.project?.projectName} {req.assignedManager && `· Assigned: ${req.assignedManager}`}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '16px 28px', borderTop: '1px solid #e2e8f0',
                            display: 'flex', justifyContent: 'flex-end'
                        }}>
                            <button className="modal-btn-cancel" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminClients;
