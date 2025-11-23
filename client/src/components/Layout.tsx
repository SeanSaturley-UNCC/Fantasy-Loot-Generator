import React, { useState, useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import { checkSession, logoutUser } from '../requests/userRequests';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const userData = await checkSession();
                setUser(userData);
            } catch (err) {
                // User not logged in
                setUser(null);
            }
        };
        fetchSession();
    }, []);

    const handleLogout = async () => {
        try {
            if (user?._id) {
                await logoutUser(user._id);
            }
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div>
            <NavBar username={user?.username} onLogout={handleLogout} />
            <div className="page-content">
                {children}
            </div>
        </div>
    );
};
