import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Client.css';

function ClientLayout() {
    const navigate = useNavigate();
    const clientUser = JSON.parse(localStorage.getItem('clientUser'));

    useEffect(() => {
        if (!clientUser) {
            navigate('/client/login');
        }
    }, [clientUser, navigate]);

    // Protect the route
    if (!clientUser) {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('clientUser');
        navigate('/client/login');
    };

    return (
        <div className="client-layout">
            <nav className="client-navbar">
                <div className="client-nav-brand">
                    ✦ ProjectNexus <span style={{ fontWeight: 400, color: 'var(--client-text-muted)' }}>| Client Portal</span>
                </div>
                <div className="client-nav-profile">
                    <span style={{ fontWeight: 500, color: 'var(--client-text-main)' }}>
                        {clientUser.name}
                    </span>
                    <button onClick={handleLogout} className="client-logout-btn">
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="client-main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default ClientLayout;
