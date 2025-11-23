import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';

interface NavBarProps {
    username?: string;
    onLogout?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ username, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        navigate('/login');
    };

    // Don't show navbar on login/signup pages
    if (location.pathname === '/login' || location.pathname === '/create-user') {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/home" className="navbar-logo">
                    ⚔️ Fantasy Loot Generator
                </Link>
                
                <div className="navbar-menu">
                    <Link 
                        to="/generate" 
                        className={`navbar-link ${isActive('/generate')} ${isActive('/home')}`}
                    >
                        Generate Loot
                    </Link>
                    <Link 
                        to="/inventory" 
                        className={`navbar-link ${isActive('/inventory')}`}
                    >
                        Inventory
                    </Link>
                    <Link 
                        to="/trades" 
                        className={`navbar-link ${isActive('/trades')}`}
                    >
                        View Trades
                    </Link>
                    <Link 
                        to="/create-trade" 
                        className={`navbar-link ${isActive('/create-trade')}`}
                    >
                        Create Trade
                    </Link>
                </div>

                <div className="navbar-user">
                    {username && (
                        <>
                            <span className="navbar-username">👤 {username}</span>
                            <button onClick={handleLogout} className="navbar-logout">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
