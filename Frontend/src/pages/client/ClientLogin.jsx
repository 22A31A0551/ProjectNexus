import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientLogin.css';

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
                setError('No account found. Please contact your project manager.');
            }
        } catch {
            setError('Unable to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cl-page">
            {/* ── LEFT PANEL ── */}
            <div className="cl-left">
                {/* Stars */}
                <div className="cl-stars" aria-hidden="true">
                    {[...Array(60)].map((_, i) => (
                        <span key={i} className="cl-star" style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${2 + Math.random() * 3}s`
                        }} />
                    ))}
                </div>

                {/* Brand */}
                <div className="cl-brand">
                    <div className="cl-brand-icon">✦</div>
                    <span className="cl-brand-name">ProjectNexus</span>
                </div>

                {/* Geometric Crystal */}
                <div className="cl-crystal-wrapper" aria-hidden="true">
                    <div className="cl-crystal">
                        <div className="cl-crystal-face cl-face-1" />
                        <div className="cl-crystal-face cl-face-2" />
                        <div className="cl-crystal-face cl-face-3" />
                        <div className="cl-crystal-face cl-face-4" />
                        <div className="cl-glow-ring cl-ring-1" />
                        <div className="cl-glow-ring cl-ring-2" />
                        <div className="cl-glow-ring cl-ring-3" />
                    </div>
                </div>

                {/* Tagline */}
                <div className="cl-left-footer">
                    <h2 className="cl-tagline">Your Complete<br /><span>Project Ecosystem</span></h2>
                    <p className="cl-subtagline">Track projects, raise support requests,<br />and stay connected with your team.</p>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="cl-right">
                <div className="cl-form-card">
                    <div className="cl-form-header">
                        <div className="cl-avatar-ring">✦</div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to access your client portal</p>
                    </div>

                    {error && (
                        <div className="cl-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="cl-form">
                        <div className="cl-field">
                            <label htmlFor="client-email">Email Address</label>
                            <div className="cl-input-box">
                                <svg className="cl-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <input
                                    id="client-email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="yourname@company.com"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button type="submit" className="cl-btn" disabled={loading}>
                            {loading ? (
                                <span className="cl-loading"><span className="cl-spinner" />Authenticating…</span>
                            ) : (
                                <>Sign In to Portal <span className="cl-arrow">→</span></>
                            )}
                        </button>
                    </form>

                    <p className="cl-help">
                        Need access? Contact <a href="mailto:support@projectnexus.com">support@projectnexus.com</a>
                    </p>
                </div>

                <p className="cl-copyright">© 2026 ProjectNexus · All rights reserved</p>
            </div>
        </div>
    );
}

export default ClientLogin;
