import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Developer.css';

const NAV_ITEMS = [
    {
        path: '/developer/overview',
        label: 'Overview',
        icon: (
            <svg className="dev-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
        ),
    },
    {
        path: '/developer/projects/active',
        label: 'Active Projects',
        icon: (
            <svg className="dev-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        ),
        badgeKey: 'activeCount',
        badgeColor: '',
    },
    {
        path: '/developer/projects/pending',
        label: 'Pending Projects',
        icon: (
            <svg className="dev-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
        ),
        badgeKey: 'pendingCount',
        badgeColor: 'orange',
    },
    {
        path: '/developer/projects/closed',
        label: 'Closed Projects',
        icon: (
            <svg className="dev-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
        ),
    },
];

function DeveloperLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [counts, setCounts] = useState({ activeCount: 0, pendingCount: 0 });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user || user.role !== 'DEVELOPER') {
            navigate('/');
        }
    }, [navigate]);

    if (!user || user.role !== 'DEVELOPER') return null;

    const devName = user.name || 'Developer';

    // Fetch overview counts for sidebar badges
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const res = await fetch(
                    `${window.API_BASE_URL}/api/developer/overview?developer=${encodeURIComponent(devName)}`
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
    }, [devName]);

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="dev-layout">
            {/* Topbar */}
            <header className="dev-topbar">
                <div className="dev-topbar-left">
                    <button
                        className="dev-hamburger"
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
                    <div className="dev-brand">
                        <span className="mgr-brand-dot" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#6d28d9' }} />
                        ProjectNexus
                    </div>
                </div>
                <div className="dev-topbar-right">
                    <span className="dev-role-badge">DEVELOPER</span>
                    <span className="dev-username">{devName}</span>
                    <button className="dev-logout-btn" id="dev-logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="dev-body">
                {/* Mobile backdrop */}
                {mobileSidebarOpen && (
                    <div className="dev-mobile-backdrop" onClick={() => setMobileSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <aside className={`dev-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
                    <div className="dev-sidebar-header">Navigation</div>

                    <nav>
                        {NAV_ITEMS.map(item => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                id={`dev-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                className={({ isActive }) =>
                                    `dev-nav-item${isActive ? ' active' : ''}`
                                }
                            >
                                {item.icon}
                                {item.label}
                                {item.badgeKey && counts[item.badgeKey] > 0 && (
                                    <span className={`dev-nav-badge ${item.badgeColor || ''}`}>
                                        {counts[item.badgeKey]}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="dev-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DeveloperLayout;
