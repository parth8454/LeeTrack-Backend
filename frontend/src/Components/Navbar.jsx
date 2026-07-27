import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import './Navbar.css';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const userName = localStorage.getItem('loggedInUser') || "User";

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        handleSuccess('Logged out! See you soon. 🕯️');
        setTimeout(() => navigate('/login'),500);
    };

    return (
        <nav className="navbar">
            
            <div className="nav-left">
                <span className="badge">LeeTrack </span>
            </div>

            <div className="nav-center">
                <p className="aesthetic-quote">"Slow progress is better than no progress."</p>
                <button className="coming-soon-btn">Coming Soon</button>
            </div>

            <div className="nav-right">
                <div className="profile-container" onClick={() => setShowDropdown(!showDropdown)}>
                    <div className="profile-trigger">
                        <span>{userName}</span>
                        <i className="dropdown-icon">▼</i>
                    </div>

                    {showDropdown && (
                        <div className="dropdown-menu">
                            <div className="dropdown-item" onClick={() => navigate('/home/profile')}>Profile</div>
                            <div className="dropdown-item logout" onClick={handleLogout}>Logout</div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;