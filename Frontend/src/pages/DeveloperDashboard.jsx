import React from 'react';
import { useNavigate } from 'react-router-dom';

function DeveloperDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-topbar">
                <div className="dashboard-brand">✦ ProjectNexus</div>
                <div className="dashboard-user-info">
                    <span className="dashboard-role-badge developer-badge">DEVELOPER</span>
                    <span className="dashboard-username">{user.name || 'Developer'}</span>
                    <button className="dashboard-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="dashboard-coming-soon">
                <div className="dashboard-icon">💻</div>
                <h1>Developer Dashboard</h1>
                <p style={{ fontSize: '1.2rem', margin: '10px 0', color: '#10b981' }}>
                    Welcome back, <strong>{user.name || 'Developer'}</strong>! (Key: {user.key || 'N/A'})
                </p>
                <p>This page is under construction. Come back soon!</p>
            </div>
        </div>
    );
}

export default DeveloperDashboard;
