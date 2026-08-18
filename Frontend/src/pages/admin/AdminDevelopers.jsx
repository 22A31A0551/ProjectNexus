import React, { useState, useEffect } from 'react';
import './Admin.css';

function AdminDevelopers() {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [skills, setSkills] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDevelopers();
    }, []);

    const fetchDevelopers = async () => {
        try {
            if (developers.length === 0) {
                setLoading(true);
            }
            const res = await fetch(window.API_BASE_URL + '/api/admin/developers');
            if (res.ok) {
                setDevelopers(await res.json());
            }
        } catch (err) {
            console.error('Failed to fetch developers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch(window.API_BASE_URL + '/api/admin/developers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, skills })
            });

            if (res.ok) {
                const newDev = await res.json();
                setDevelopers([...developers, newDev]);
                setShowModal(false);
                setName('');
                setEmail('');
                setPassword('');
                setSkills('');
            } else {
                const errMsg = await res.text();
                setError(errMsg || 'Failed to add developer.');
            }
        } catch (err) {
            setError('Error connecting to the server.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h2>Developer Monitoring</h2>
                    <p>Track all developers, their assignments, and skills.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Add Developer
                </button>
            </div>

            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(123,97,255,0.15)' }}>👨‍💻</div>
                    <div className="stat-info">
                        <span className="stat-value">{developers.length}</span>
                        <span className="stat-label">Total Developers</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>🟢</div>
                    <div className="stat-info">
                        <span className="stat-value">{developers.length}</span>
                        <span className="stat-label">Active</span>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 20px 0', color: '#1e1b4b' }}>All Developers</h3>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Developer</th>
                                <th>Skills</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#475569' }}>Loading developers...</td>
                                </tr>
                            ) : developers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#475569' }}>No developers found.</td>
                                </tr>
                            ) : (
                                developers.map(dev => {
                                    const skillsArr = dev.skills ? dev.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
                                    return (
                                        <tr key={dev.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700, fontSize: '0.9rem', color: '#fff'
                                                    }}>
                                                        {dev.name ? dev.name.charAt(0) : 'D'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{dev.name || 'Developer'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                    {skillsArr.length > 0 ? (
                                                        skillsArr.map(s => (
                                                            <span key={s} style={{
                                                                background: 'rgba(123,97,255,0.1)', color: 'var(--admin-accent)',
                                                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                                            }}>{s}</span>
                                                        ))
                                                    ) : (
                                                        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>None specified</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ color: '#475569' }}>{dev.email}</td>
                                            <td>
                                                <span className="status-badge active" style={{ fontSize: '0.75rem' }}>
                                                    {dev.role}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Developer Modal */}
            {showModal && (
                <div className="monochrome-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="monochrome-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                        <h3 style={{ margin: '0 0 16px 0', color: '#1e1b4b' }}>Add New Developer</h3>
                        
                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.1)', color: '#dc2626',
                                padding: '10px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px'
                            }}>
                                ⚠ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="modal-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    required
                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                            </div>

                            <div className="modal-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="e.g. john@projectnexus.com"
                                    required
                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                            </div>

                            <div className="modal-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Create temporary password"
                                    required
                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                            </div>

                            <div className="modal-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={skills}
                                    onChange={e => setSkills(e.target.value)}
                                    placeholder="e.g. React, Node.js, Spring Boot"
                                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                />
                            </div>

                            <div className="modal-actions" style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                    type="button"
                                    className="modal-btn-cancel"
                                    onClick={() => setShowModal(false)}
                                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'none', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={submitting}
                                    style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    {submitting ? 'Saving...' : 'Add Developer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDevelopers;
