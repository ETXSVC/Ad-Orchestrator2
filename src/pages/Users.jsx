import { useState, useEffect } from 'react';
import { usersAPI } from '../api/client';
import { Plus, UserPlus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useApp();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await usersAPI.list();
            setUsers(response.data.users);
        } catch (error) {
            console.error('Failed to load users:', error);
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role) => {
        const colors = {
            admin: 'error',
            manager: 'warning',
            creator: 'info',
            approver: 'success',
            user: 'gray'
        };
        return colors[role] || 'gray';
    };

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Team Members</h1>
                    <p className="page-subtitle">Manage your team and permissions</p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus size={18} />
                    Add Team Member
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
                </div>
            ) : users.length === 0 ? (
                <div className="empty-state">
                    <p className="text-lg font-semibold mb-sm">No team members</p>
                    <p className="text-gray-500 mb-lg">Add your first team member</p>
                    <button className="btn btn-primary">
                        <UserPlus size={18} />
                        Add Team Member
                    </button>
                </div>
            ) : (
                <div className="grid grid-3">
                    {users.map((user) => (
                        <div key={user.id} className="card">
                            <div className="flex items-start justify-between mb-md">
                                <div className="flex items-center gap-md">
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '18px'
                                    }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{user.name}</h3>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-sm">
                                <span className={`badge badge-${getRoleBadge(user.role)}`}>
                                    {user.role}
                                </span>
                                <span className={`badge badge-${user.status === 'active' ? 'success' : 'gray'}`}>
                                    {user.status}
                                </span>
                            </div>
                            {user.department && (
                                <p className="text-xs text-gray-500 mt-sm">Department: {user.department}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
