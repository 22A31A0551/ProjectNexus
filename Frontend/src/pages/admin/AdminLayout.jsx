import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin User"}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard Overview', icon: '📊' },
        { path: '/admin/clients', label: 'Client Management', icon: '👥' },
        { path: '/admin/projects', label: 'Project Repository', icon: '📁' },
        { path: '/admin/requests/new', label: 'New Requests', icon: '🔔' },
        { path: '/admin/requests/active', label: 'Active Requests', icon: '⚡' },
        { path: '/admin/managers', label: 'Manager Assignment', icon: '👔' },
        { path: '/admin/developers', label: 'Developer Monitoring', icon: '💻' },
        { path: '/admin/revenue', label: 'Revenue Management', icon: '💰' },
        { path: '/admin/history', label: 'Closed Tickets', icon: '✅' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <span className="brand-logo">✦</span>
                    {isSidebarOpen && <span className="brand-name">ProjectNexus</span>}
                </div>
                
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {isSidebarOpen && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main">
                {/* Topbar */}
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button 
                            className="toggle-sidebar-btn"
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                        >
                            ☰
                        </button>
                        <h2 className="page-title">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Admin Panel'}
                        </h2>
                    </div>

                    <div className="topbar-right">
                        <div className="notification-bell">
                            🔔 <span className="badge">3</span>
                        </div>
                        <div className="user-profile">
                            <span className="role-badge">ADMIN</span>
                            <span className="user-name">{user.name}</span>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="admin-content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;
