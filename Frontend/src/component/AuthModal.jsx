import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successRole, setSuccessRole] = useState('');
    const [error, setError] = useState('');

    // Form states
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');

    // Password visibility
    const [showLoginPass, setShowLoginPass] = useState(false);
    const [showRegPass, setShowRegPass] = useState(false);
    const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);

    const [showKeyPrompt, setShowKeyPrompt] = useState(false);
    const [keyRole, setKeyRole] = useState('');
    const [tempUserData, setTempUserData] = useState(null);
    const [enteredKey, setEnteredKey] = useState('');

    // Reset forms when modal closes
    useEffect(() => {
        if (!isOpen) {
            setLoginEmail('');
            setLoginPassword('');
            setRegName('');
            setRegEmail('');
            setRegPhone('');
            setRegPassword('');
            setRegConfirmPassword('');
            setShowLoginPass(false);
            setShowRegPass(false);
            setShowRegConfirmPass(false);
            setIsSuccess(false);
            setSuccessRole('');
            setError('');
            setShowKeyPrompt(false);
            setKeyRole('');
            setTempUserData(null);
            setEnteredKey('');
        }
    }, [isOpen]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const switchMode = () => {
        setError('');
        setIsAnimating(true);
        setTimeout(() => {
            setIsLogin(!isLogin);
            setIsAnimating(false);
        }, 250);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Invalid email or password.');
                return;
            }

            const role = data.role?.toLowerCase() || 'client';
            
            // If manager or developer, prompt for their specific key
            if (role === 'manager' || role === 'developer') {
                setTempUserData(data);
                setKeyRole(role);
                setShowKeyPrompt(true);
                setEnteredKey('');
                return;
            }

            if (role === 'client') {
                localStorage.setItem('clientUser', JSON.stringify(data));
            } else {
                localStorage.setItem('user', JSON.stringify(data));
            }

            setSuccessRole(role);
            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                setSuccessRole('');
                onClose();
                if (role === 'client') {
                    navigate('/client/dashboard');
                } else {
                    navigate('/' + role);
                }
            }, 3000);

        } catch (err) {
            if (err instanceof SyntaxError) {
                setError('Invalid email or password.');
            } else {
                setError('Cannot connect to server. Please make sure the backend is running on port 8080.');
            }
        }
    };

    const handleKeySubmit = (e) => {
        e.preventDefault();
        setError('');

        const normalizedKey = enteredKey.trim().toUpperCase();

        if (keyRole === 'manager') {
            const validKeys = {
                'MGR1': 'manager1',
                'MGR2': 'manager2',
                'MGR3': 'manager3',
                'MGR4': 'manager4',
                'MGR5': 'manager5'
            };

            if (!validKeys[normalizedKey]) {
                setError('Invalid key. Please enter a valid manager key (mgr1 - mgr5).');
                return;
            }

            const finalUser = {
                ...tempUserData,
                name: validKeys[normalizedKey],
                key: normalizedKey
            };

            localStorage.setItem('user', JSON.stringify(finalUser));
            setShowKeyPrompt(false);
            setSuccessRole('manager');
            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                setSuccessRole('');
                onClose();
                navigate('/manager');
            }, 3000);

        } else if (keyRole === 'developer') {
            const validKeys = {
                'DEV1': 'Kiran Kumar',
                'DEV2': 'Divya Rao',
                'DEV3': 'Sai Teja',
                'DEV4': 'Lakshmi Naidu',
                'DEV5': 'Venkat Raju'
            };

            if (!validKeys[normalizedKey]) {
                setError('Invalid key. Please enter a valid developer key (dev1 - dev5).');
                return;
            }

            const finalUser = {
                ...tempUserData,
                name: validKeys[normalizedKey],
                key: normalizedKey
            };

            localStorage.setItem('user', JSON.stringify(finalUser));
            setShowKeyPrompt(false);
            setSuccessRole('developer');
            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                setSuccessRole('');
                onClose();
                navigate('/developer');
            }, 3000);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (regPassword !== regConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: regName, email: regEmail, phoneNumber: regPhone, password: regPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Registration failed. Please try again.');
                return;
            }

            // Auto-login after registration
            const loginRes = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: regEmail, password: regPassword }),
            });
            const loginData = await loginRes.json();
            if (loginRes.ok) {
                localStorage.setItem('clientUser', JSON.stringify(loginData));
            }

            setSuccessRole('client');
            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                setSuccessRole('');
                onClose();
                navigate('/client/dashboard');
            }, 3000);

        } catch (err) {
            if (err instanceof SyntaxError) {
                setError('Registration failed. Please try again.');
            } else {
                setError('Cannot connect to server. Please make sure the backend is running on port 8080.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div
                className={`auth-modal ${isAnimating ? 'auth-modal-switching' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button className="auth-close-btn" onClick={onClose} aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Decorative glow */}
                <div className="auth-modal-glow"></div>

                {isSuccess ? (
                    /* Success View */
                    <div className="auth-success-view">
                        <div className="auth-success-icon">✓</div>
                        <h2 className="auth-success-title">Login Successful!</h2>
                        <p className="auth-success-subtitle">
                            Welcome back, <span className="role-text">{successRole.toUpperCase()}</span>
                        </p>
                        <div className="auth-loader-bar">
                            <div className="auth-loader-progress"></div>
                        </div>
                        <p className="auth-redirect-text">Opening your dashboard...</p>
                    </div>
                ) : showKeyPrompt ? (
                    /* Key Prompt View */
                    <div className="auth-key-prompt-view">
                        <div className="auth-header">
                            <div className="auth-logo-icon">🔑</div>
                            <h2 className="auth-title">Enter Access Key</h2>
                            <p className="auth-subtitle">
                                Please enter your unique access key to verify your identity
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error-banner">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleKeySubmit}>
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="access-key">
                                    Access Key
                                </label>
                                <input
                                    type="password"
                                    id="access-key"
                                    className="auth-input"
                                    placeholder={keyRole === 'manager' ? 'e.g. MGR1' : 'e.g. DEV1'}
                                    value={enteredKey}
                                    onChange={(e) => setEnteredKey(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <button type="submit" className="auth-submit-btn">
                                <span>Verify & Enter</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="auth-header">
                            <div className="auth-logo-icon">✦</div>
                            <h2 className="auth-title">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="auth-subtitle">
                                {isLogin
                                    ? 'Sign in to access your dashboard'
                                    : 'Join ProjectNexus and get started'}
                            </p>
                        </div>

                        {/* Error Banner */}
                        {error && (
                            <div className="auth-error-banner">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        {isLogin ? (
                            <form className="auth-form" onSubmit={handleLoginSubmit} id="login-form">
                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="login-email">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                        </svg>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="login-email"
                                        className="auth-input"
                                        placeholder="you@example.com"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="login-password">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                        Password
                                    </label>
                                    <div className="auth-input-wrap">
                                        <input
                                            type={showLoginPass ? 'text' : 'password'}
                                            id="login-password"
                                            className="auth-input auth-input-password"
                                            placeholder="Enter your password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="auth-toggle-pass"
                                            onClick={() => setShowLoginPass(!showLoginPass)}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showLoginPass ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="auth-submit-btn" id="login-submit-btn">
                                    <span>Sign In</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </form>
                        ) : (
                            /* Register Form */
                            <form className="auth-form" onSubmit={handleRegisterSubmit} id="register-form">
                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="reg-name">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="reg-name"
                                        className="auth-input"
                                        placeholder="John Doe"
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="reg-email">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                        </svg>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="reg-email"
                                        className="auth-input"
                                        placeholder="you@example.com"
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="reg-phone">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                        </svg>
                                        Phone Number (Intl. Format)
                                    </label>
                                    <input
                                        type="tel"
                                        id="reg-phone"
                                        className="auth-input"
                                        placeholder="+1 234 567 8900"
                                        value={regPhone}
                                        onChange={(e) => setRegPhone(e.target.value)}
                                        required
                                        autoComplete="tel"
                                    />
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="reg-password">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                        Create Password
                                    </label>
                                    <div className="auth-input-wrap">
                                        <input
                                            type={showRegPass ? 'text' : 'password'}
                                            id="reg-password"
                                            className="auth-input auth-input-password"
                                            placeholder="Create a strong password"
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="auth-toggle-pass"
                                            onClick={() => setShowRegPass(!showRegPass)}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showRegPass ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="reg-confirm-password">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                        Confirm Password
                                    </label>
                                    <div className="auth-input-wrap">
                                        <input
                                            type={showRegConfirmPass ? 'text' : 'password'}
                                            id="reg-confirm-password"
                                            className="auth-input auth-input-password"
                                            placeholder="Confirm your password"
                                            value={regConfirmPassword}
                                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="auth-toggle-pass"
                                            onClick={() => setShowRegConfirmPass(!showRegConfirmPass)}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showRegConfirmPass ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="auth-submit-btn" id="register-submit-btn">
                                    <span>Create Account</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </form>
                        )}

                        {/* Switch Login / Register */}
                        <div className="auth-divider">
                            <span className="auth-divider-line"></span>
                            <span className="auth-divider-text">{isLogin ? 'New here?' : 'Already a member?'}</span>
                            <span className="auth-divider-line"></span>
                        </div>

                        <div className="auth-switch">
                            <p className="auth-switch-text">
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            </p>
                            <button
                                type="button"
                                className="auth-switch-btn"
                                onClick={switchMode}
                                id="auth-switch-btn"
                            >
                                {isLogin ? 'Register Now' : 'Sign In'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AuthModal;
