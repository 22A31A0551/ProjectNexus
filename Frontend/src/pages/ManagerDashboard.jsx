import React from 'react';
import { useNavigate } from 'react-router-dom';

function ManagerDashboard() {
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
                    <span className="dashboard-role-badge manager-badge">MANAGER</span>
                    <span className="dashboard-username">{user.name || 'Manager'}</span>
                    <button className="dashboard-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="dashboard-coming-soon">
                <div className="dashboard-icon">📋</div>
                <h1>Manager Dashboard</h1>
                <p>This page is under construction. Come back soon!</p>
            </div>
        </div>
    );
}

export default ManagerDashboard;
