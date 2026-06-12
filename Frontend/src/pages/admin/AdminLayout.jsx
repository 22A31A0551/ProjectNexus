import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDashboardOpen, setDashboardOpen] = useState(true);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedManager, setSelectedManager] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin"}');

    const availableManagers = [
        'Ravi Shankar',
        'Priya Patel',
        'Sneha Reddy'
    ];

    const fetchPendingRequests = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/admin/requests/pending');
            if (res.ok) {
                const data = await res.json();
                setPendingRequests(data);
            }
        } catch (err) {
            console.error('Error fetching pending requests:', err);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
        // Poll every 10 seconds for new requests to make it dynamic
        const interval = setInterval(fetchPendingRequests, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleAcceptRequest = async (requestId) => {
        if (!selectedManager) {
            alert('Please select a manager to assign this ticket.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/admin/requests/${requestId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'Accepted',
                    assignedManager: selectedManager
                })
            });
            if (response.ok) {
                setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
                setSelectedRequest(null);
                setSelectedManager('');
                setNotificationOpen(false);
                // Trigger event to refresh other pages if needed
                window.dispatchEvent(new Event('requestAccepted'));
            }
        } catch (err) {
            console.error('Error accepting request:', err);
        }
    };

    const navItems = [
        { path: '/admin/clients', label: 'Client Management' },
        { path: '/admin/requests/active', label: 'Active Requests' },
        { path: '/admin/requests/new', label: 'Pending Requests' },
        { path: '/admin/projects', label: 'Project Repository' },
        { path: '/admin/managers', label: 'Manager Assignment' },
        { path: '/admin/revenue', label: 'Revenue Management' },
        { path: '/admin/history', label: 'Closed Tickets' },
    ];

    return (
        <div className="admin-layout-container">
            {/* Topbar Navbar */}
            <header className="admin-navbar-top">
                <div className="navbar-left">
                    <span className="navbar-brand">✦ ProjectNexus</span>
                </div>
                <div className="navbar-right">
                    {/* Notification Bell Outline */}
                    <div className="navbar-action-item notification-wrapper">
                        <button 
                            className="monochrome-btn bell-btn" 
                            onClick={() => setNotificationOpen(!isNotificationOpen)}
                            title="Notifications"
                        >
                            <svg className="monochrome-svg" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                            </svg>
                            {pendingRequests.length > 0 && (
                                <span className="monochrome-badge">{pendingRequests.length}</span>
                            )}
                        </button>
                        
                        {isNotificationOpen && (
                            <div className="notification-dropdown-menu">
                                <h4>New Request Notifications ({pendingRequests.length})</h4>
                                <div className="notification-list">
                                    {pendingRequests.length === 0 ? (
                                        <p className="no-notifications">No pending requests</p>
                                    ) : (
                                        pendingRequests.map(req => (
                                            <div key={req.id} className="notification-item">
                                                <div className="notification-details">
                                                    <strong>{req.requestType}</strong>
                                                    <span>From: {req.client?.name}</span>
                                                    <span>Proj: {req.project?.projectName}</span>
                                                </div>
                                                <button 
                                                    className="mini-accept-btn" 
                                                    onClick={() => setSelectedRequest(req)}
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="navbar-action-item">
                        <span className="admin-status-btn">ADMIN</span>
                    </div>
                    
                    <div className="navbar-action-item">
                        <button className="monochrome-logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </header>

            <div className="admin-layout-body">
                {/* Sidebar below navbar */}
                <aside className="admin-sidebar-side">
                    <nav className="sidebar-nav-container">
                        <div className="menu-group">
                            <button 
                                className={`menu-header-btn ${isDashboardOpen ? 'expanded' : ''}`}
                                onClick={() => setDashboardOpen(!isDashboardOpen)}
                            >
                                <span className="menu-header-text">Dashboard</span>
                                <span className="arrow-icon">{isDashboardOpen ? '▼' : '▶'}</span>
                            </button>
                            
                            {isDashboardOpen && (
                                <div className="menu-submenu">
                                    <Link 
                                        to="/admin" 
                                        className={`submenu-item ${location.pathname === '/admin' ? 'active' : ''}`}
                                    >
                                        Overview
                                    </Link>
                                    {navItems.map((item) => (
                                        <Link 
                                            key={item.path} 
                                            to={item.path} 
                                            className={`submenu-item ${location.pathname === item.path ? 'active' : ''}`}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="admin-main-viewport">
                    <Outlet />
                </main>
            </div>

            {/* Manager Assignment Modal for accepting requests */}
            {selectedRequest && (
                <div className="monochrome-modal-overlay">
                    <div className="monochrome-modal">
                        <h3>Assign Manager & Accept Ticket</h3>
                        <p>Assigning support request: <strong>{selectedRequest.requestType}</strong> from <strong>{selectedRequest.client?.name}</strong></p>
                        
                        <div className="modal-form-group">
                            <label>Select Available Manager</label>
                            <select 
                                value={selectedManager} 
                                onChange={(e) => setSelectedManager(e.target.value)}
                                required
                            >
                                <option value="">-- Select Manager --</option>
                                {availableManagers.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button 
                                className="modal-btn-cancel" 
                                onClick={() => { setSelectedRequest(null); setSelectedManager(''); }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-btn-confirm" 
                                onClick={() => handleAcceptRequest(selectedRequest.id)}
                                disabled={!selectedManager}
                            >
                                Assign & Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminLayout;
