import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import '../admin/Admin.css';

const STORAGE_KEY = 'clientSeenNotifications';

function ClientLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const clientUser = JSON.parse(localStorage.getItem('clientUser'));

    // --- Notification state ---
    const [notifications, setNotifications] = useState([]);   // accepted requests not yet dismissed
    const [showDropdown, setShowDropdown] = useState(false);
    const [seenIds, setSeenIds] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch { return []; }
    });
    const dropdownRef = useRef(null);
    const pollRef    = useRef(null);

    useEffect(() => {
        if (!clientUser) { navigate('/client/login'); }
    }, []);

    if (!clientUser) return null;

    // Fetch accepted requests and compute unseen ones
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/client/${clientUser.id}/requests`);
            if (!res.ok) return;
            const data = await res.json();
            const accepted = data.filter(r => r.status === 'Accepted');
            const currentSeenIds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            const unseen = accepted.filter(r => !currentSeenIds.includes(r.id));
            setNotifications(unseen);
        } catch (_) { /* silently fail */ }
    }, [clientUser?.id]);

    useEffect(() => {
        fetchNotifications();
        pollRef.current = setInterval(fetchNotifications, 30000); // poll every 30 s
        return () => clearInterval(pollRef.current);
    }, [fetchNotifications]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllSeen = () => {
        const newSeen = [...seenIds, ...notifications.map(n => n.id)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeen));
        setSeenIds(newSeen);
        setNotifications([]);
    };

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem('clientUser');
        navigate('/');
    };

    const unreadCount = notifications.length;

    return (
        <div className="admin-layout-container">
            {/* Topbar */}
            <header className="admin-navbar-top">
                <div className="navbar-left">
                    <span className="navbar-brand">✦ ProjectNexus</span>
                </div>
                <div className="navbar-right">
                    <div className="navbar-action-item">
                        <span className="admin-status-btn">CLIENT</span>
                    </div>
                    <div className="navbar-action-item">
                        <span style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 500 }}>
                            {clientUser.name}
                        </span>
                    </div>

                    {/* ── Notification Bell ── */}
                    <div className="navbar-action-item" style={{ position: 'relative' }} ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            title="Notifications"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                padding: '6px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            {/* Bell SVG */}
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
                                stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>

                            {/* Red badge */}
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '2px', right: '2px',
                                    background: '#ef4444',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '16px', height: '16px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid #1e1b4b',
                                    lineHeight: 1,
                                    pointerEvents: 'none',
                                }}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* ── Dropdown Panel ── */}
                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 12px)',
                                right: 0,
                                width: '340px',
                                background: '#ffffff',
                                borderRadius: '14px',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                                zIndex: 9999,
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                animation: 'fadeSlideIn 0.18s ease',
                            }}>
                                {/* Panel header */}
                                <div style={{
                                    padding: '14px 18px',
                                    borderBottom: '1px solid #f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: '#f8fafc',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '30px', height: '30px',
                                            background: '#1e1b4b', borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                                                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                            </svg>
                                        </div>
                                        <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.95rem' }}>
                                            Notifications
                                        </span>
                                        {unreadCount > 0 && (
                                            <span style={{
                                                background: '#ef4444', color: '#fff',
                                                borderRadius: '20px', padding: '1px 7px',
                                                fontSize: '0.72rem', fontWeight: 700,
                                            }}>
                                                {unreadCount} New
                                            </span>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllSeen}
                                            style={{
                                                background: 'none', border: 'none',
                                                color: '#6d28d9', fontSize: '0.78rem',
                                                fontWeight: 600, cursor: 'pointer',
                                            }}
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                {/* Notification list */}
                                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{
                                            padding: '36px 20px',
                                            textAlign: 'center',
                                            color: '#94a3b8',
                                            display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', gap: '10px',
                                        }}>
                                            <div style={{
                                                width: '44px', height: '44px',
                                                background: '#f1f5f9', borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
                                                    stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                                </svg>
                                            </div>
                                            <span style={{ fontSize: '0.88rem' }}>You're all caught up!</span>
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} style={{
                                                padding: '14px 18px',
                                                borderBottom: '1px solid #f1f5f9',
                                                display: 'flex',
                                                gap: '12px',
                                                alignItems: 'flex-start',
                                                background: '#fff',
                                                transition: 'background 0.15s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                            >
                                                {/* Green check icon */}
                                                <div style={{
                                                    width: '36px', height: '36px', flexShrink: 0,
                                                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                                                    borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                                                        stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"/>
                                                    </svg>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{
                                                        margin: 0, fontWeight: 600,
                                                        color: '#1e1b4b', fontSize: '0.88rem',
                                                    }}>
                                                        Request Accepted ✓
                                                    </p>
                                                    <p style={{
                                                        margin: '3px 0 0',
                                                        color: '#475569', fontSize: '0.8rem',
                                                        lineHeight: 1.4,
                                                    }}>
                                                        Your <strong>{n.requestType}</strong> request for{' '}
                                                        <strong>{n.project?.projectName}</strong> was accepted successfully.
                                                        {n.assignedManager && (
                                                            <span> Manager: <strong>{n.assignedManager}</strong>.</span>
                                                        )}
                                                    </p>
                                                    <p style={{
                                                        margin: '5px 0 0',
                                                        color: '#94a3b8', fontSize: '0.74rem',
                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                    }}>
                                                        <svg viewBox="0 0 24 24" width="11" height="11" fill="none"
                                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <circle cx="12" cy="12" r="10"/>
                                                            <polyline points="12 6 12 12 16 14"/>
                                                        </svg>
                                                        REQ-{String(n.id).padStart(4, '0')}
                                                    </p>
                                                </div>
                                                {/* Unread dot */}
                                                <div style={{
                                                    width: '8px', height: '8px', flexShrink: 0,
                                                    background: '#6d28d9', borderRadius: '50%',
                                                    marginTop: '6px',
                                                }}/>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{
                                    padding: '10px 18px',
                                    borderTop: '1px solid #f1f5f9',
                                    background: '#f8fafc',
                                }}>
                                    <Link
                                        to="/client/support/active"
                                        onClick={() => { markAllSeen(); setShowDropdown(false); }}
                                        style={{
                                            display: 'block', textAlign: 'center',
                                            color: '#1e1b4b', fontWeight: 600,
                                            fontSize: '0.82rem', textDecoration: 'none',
                                        }}
                                    >
                                        View Active Support →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="navbar-action-item">
                        <button className="monochrome-logout-btn" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-layout-body">
                {/* Sidebar */}
                <aside className="admin-sidebar-side">
                    <nav className="sidebar-nav-container">
                        <div className="menu-group">
                            <button className="menu-header-btn expanded">
                                <span className="menu-header-text">Dashboard</span>
                                <span className="arrow-icon">▼</span>
                            </button>
                            <div className="menu-submenu">
                                <Link
                                    to="/client/dashboard"
                                    className={`submenu-item ${location.pathname === '/client/dashboard' ? 'active' : ''}`}
                                >
                                    Overview
                                </Link>
                                <Link
                                    to="/client/projects"
                                    className={`submenu-item ${location.pathname === '/client/projects' ? 'active' : ''}`}
                                >
                                    Projects
                                </Link>
                                <Link
                                    to="/client/support/active"
                                    className={`submenu-item ${location.pathname === '/client/support/active' ? 'active' : ''}`}
                                >
                                    Active Support
                                    {unreadCount > 0 && (
                                        <span style={{
                                            marginLeft: '8px',
                                            background: '#ef4444',
                                            color: '#fff',
                                            borderRadius: '20px',
                                            padding: '1px 7px',
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    to="/client/support/closed"
                                    className={`submenu-item ${location.pathname === '/client/support/closed' ? 'active' : ''}`}
                                >
                                    Closed Support
                                </Link>
                                <Link
                                    to="/client/support/pending"
                                    className={`submenu-item ${location.pathname === '/client/support/pending' ? 'active' : ''}`}
                                >
                                    Raise a Support
                                </Link>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="admin-main-viewport">
                    <Outlet />
                </main>
            </div>

            {/* Dropdown animation */}
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

export default ClientLayout;
