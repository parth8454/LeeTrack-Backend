import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
    { key: 'stats', label: 'Your Stats', icon: '📊', path: '/home' },
    { key: 'leaderboard', label: 'Leaderboard', icon: '🏆', path: '/home/leaderboard' },
    { key: 'sensei', label: 'AI Sensei', icon: '🥋', path: '/home/sensei' },
    { key: 'about', label: 'About Us', icon: '📚', path: '/home/about' },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // '/home' should only be "active" on the exact stats route,
    // everything else matches by prefix so nested paths still highlight correctly.
    const isActive = (path) => {
        if (path === '/home') {
            return location.pathname === '/home' || location.pathname === '/home/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="app-sidebar">
            {NAV_ITEMS.map((item) => (
                <div
                    key={item.key}
                    className={`sidebar-option ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                >
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-label">{item.label}</span>
                </div>
            ))}
        </aside>
    );
};

export default Sidebar;