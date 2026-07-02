import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Manager.css';

const NAV_ITEMS = [
    {
        path: '/manager/overview',
        label: 'Overview',
        icon: (
            <svg className="mgr-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
        ),
    },
    {
        path: '/manager/tickets/active',
        label: 'Active Tickets',
        icon: (
            <svg className="mgr-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        badgeKey: 'activeCount',
        badgeColor: '',
    },
    {
        path: '/manager/tickets/pending',
        label: 'Pending Tickets',
        icon: (
            <svg className="mgr-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
        badgeKey: 'pendingCount',
        badgeColor: 'orange',
    },
    {
        path: '/manager/tickets/closed',
        label: 'Closed Tickets',
        icon: (
            <svg className="mgr-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
        ),
    },
    {
        path: '/manager/developers',
        label: 'Developer Assignment',
        icon: (
            <svg className="mgr-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
    },
];

function ManagerLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [counts, setCounts] = useState({ activeCount: 0, pendingCount: 0 });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const managerName = user.name || 'Manager';

    // Fetch overview counts for sidebar badges
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/manager/overview?manager=${encodeURIComponent(managerName)}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setCounts({
                        activeCount: data.activeCount || 0,
                        pendingCount: data.pendingCount || 0,
                    });
                }
            } catch (err) {
                // silently ignore if backend is not ready
            }
        };
        fetchCounts();
        const interval = setInterval(fetchCounts, 15000);
        return () => clearInterval(interval);
    }, [managerName]);

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="mgr-layout">
            {/* Topbar */}
            <header className="mgr-topbar">
                <div className="mgr-topbar-left">
                    <button
                        className="mgr-hamburger"
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                            {mobileSidebarOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                            }
                        </svg>
                    </button>
                    <div className="mgr-brand">
                        <span className="mgr-brand-dot" />
                        ProjectNexus
                    </div>
                </div>
                <div className="mgr-topbar-right">
                    <span className="mgr-role-badge">MANAGER</span>
                    <span className="mgr-username">{managerName}</span>
                    <button className="mgr-logout-btn" id="mgr-logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="mgr-body">
                {/* Mobile backdrop */}
                {mobileSidebarOpen && (
                    <div className="mgr-mobile-backdrop" onClick={() => setMobileSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <aside className={`mgr-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
                    <div className="mgr-sidebar-header">Navigation</div>

                    <nav>
                        {NAV_ITEMS.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                id={`mgr-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                className={({ isActive }) =>
                                    `mgr-nav-item${isActive ? ' active' : ''}`
                                }
                            >
                                {item.icon}
                                {item.label}
                                {item.badgeKey && counts[item.badgeKey] > 0 && (
                                    <span className={`mgr-nav-badge ${item.badgeColor || ''}`}>
                                        {counts[item.badgeKey]}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="mgr-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default ManagerLayout;
