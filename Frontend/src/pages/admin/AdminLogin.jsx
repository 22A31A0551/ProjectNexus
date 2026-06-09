import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Temporary mock authentication
        if (email === 'admin@projectnexus.com' && password === 'admin') {
            localStorage.setItem('user', JSON.stringify({ name: 'System Admin', role: 'ADMIN' }));
            navigate('/admin');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="admin-login-container">
            {/* Background elements for aesthetic */}
            <div className="login-bg-glow glow-1"></div>
            <div className="login-bg-glow glow-2"></div>

            <div className="glass-card login-card">
                <div className="login-header">
                    <div className="login-brand">
                        <span className="brand-logo">✦</span>
                        <span className="brand-name">ProjectNexus</span>
                    </div>
                    <h2>Admin Portal</h2>
                    <p>Enter your credentials to access the control system.</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@projectnexus.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    
                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn-primary login-btn">
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
