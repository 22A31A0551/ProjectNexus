import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Manager.css';

const MANAGER_NAMES = ['manager1', 'manager2', 'manager3', 'manager4', 'manager5'];

function ManagerLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Invalid credentials');
            }

            const data = await res.json();

            if (data.role !== 'MANAGER') {
                throw new Error('This login is for managers only.');
            }

            // Derive manager slot name from DB name or email if needed
            const managerName = MANAGER_NAMES.includes(data.name?.toLowerCase())
                ? data.name.toLowerCase()
                : (data.name || 'manager1');

            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                name: managerName,
                email: data.email,
                role: data.role,
            }));

            navigate('/manager/overview');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mgr-login-page">
            <div className="mgr-login-card">
                <div className="mgr-login-logo">Project<span>Nexus</span></div>
                <p className="mgr-login-tagline">Manager Portal — Sign in to your dashboard</p>

                {error && <div className="mgr-login-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mgr-login-field">
                        <label htmlFor="mgr-email">Email Address</label>
                        <input
                            id="mgr-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="manager@gmail.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="mgr-login-field">
                        <label htmlFor="mgr-password">Password</label>
                        <input
                            id="mgr-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        id="mgr-login-submit"
                        type="submit"
                        className="mgr-login-submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing in…' : 'Sign In →'}
                    </button>
                </form>

                <span className="mgr-back-link" onClick={() => navigate('/')}>
                    ← Back to Home
                </span>
            </div>
        </div>
    );
}

export default ManagerLogin;
