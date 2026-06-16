import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin/Admin.css';

function ClientLogin() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const existing = localStorage.getItem('clientUser');
        if (existing) navigate('/client/dashboard');
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/client/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                const clientData = await response.json();
                localStorage.setItem('clientUser', JSON.stringify(clientData));
                navigate('/client/dashboard');
            } else {
                setError('No account found with this email. Please contact your project manager.');
            }
        } catch {
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container" style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 40%, #f3e8ff 80%, #fae8ff 100%)',
            marginTop: '-50px'
        }}>
            <div className="login-bg-glow glow-1"></div>
            <div className="login-bg-glow glow-2"></div>

            <div className="glass-card login-card">
                <div className="login-header">
                    <div className="login-brand">
                        <span className="brand-logo">✦</span>
                        <span className="brand-name" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#fff', WebkitTextFillColor: '#fff', background: 'none' }}>ProjectNexus</span>
                    </div>
                    <p style={{ color: 'rgba(160,165,181,0.9)', margin: '12px 0 0 0', fontSize: '0.95rem' }}>
                        Enter your registered email to access your portal.
                    </p>
                </div>

                {error && (
                    <div className="login-error">
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="client-email">Email Address</label>
                        <input
                            type="email"
                            id="client-email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="yourname@company.com"
                            required
                            autoFocus
                            style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(123,97,255,0.25)', color: '#fff' }}
                        />
                    </div>

                    <div className="form-options">
                        <span style={{ color: 'rgba(160,165,181,0.7)', fontSize: '0.85rem' }}>
                            🔐 Secure client access
                        </span>
                        <a href="mailto:support@projectnexus.com" className="forgot-password" style={{ fontSize: '0.85rem' }}>
                            Need access?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary login-btn"
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {loading ? (
                            <>
                                <span className="cl-spinner" style={{
                                    width: '16px', height: '16px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: '#fff',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                    display: 'inline-block'
                                }} />
                                Authenticating…
                            </>
                        ) : (
                            <>Sign In to Portal →</>
                        )}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '28px',
                    fontSize: '0.82rem',
                    color: 'rgba(160,165,181,0.6)'
                }}>
                    © 2026 ProjectNexus · All rights reserved
                </p>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default ClientLogin;
