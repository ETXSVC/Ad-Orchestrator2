import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Image, Sparkles, CheckSquare, Users, Settings } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/campaigns', icon: FolderKanban, label: 'Campaigns' },
        { path: '/assets', icon: Image, label: 'Assets' },
        { path: '/ai', icon: Sparkles, label: 'AI Workspace' },
        { path: '/approvals', icon: CheckSquare, label: 'Approvals' },
        { path: '/users', icon: Users, label: 'Users' },
        { path: '/settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-logo">Ad-Orchestrator</h1>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
