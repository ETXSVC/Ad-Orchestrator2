import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-search">
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search campaigns, assets..."
                    className="header-search-input"
                />
            </div>

            <div className="header-actions">
                <button className="header-icon-btn">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

                <div className="header-user">
                    <User size={18} />
                    <span className="header-user-name">{user?.name || 'User'}</span>
                    <button className="btn-ghost btn-sm" onClick={logout}>
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
}
