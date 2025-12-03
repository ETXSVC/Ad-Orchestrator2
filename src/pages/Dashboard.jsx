import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../api/client';
import { TrendingUp, FolderKanban, Image, Clock } from 'lucide-react';
import CreateCampaignModal from '../components/Campaigns/CreateCampaignModal';
import { useApp } from '../contexts/AppContext';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { showToast } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await dashboardAPI.getStats();
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        showToast('Campaign created successfully!', 'success');
        navigate('/campaigns');
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div></div>;
    }

    const statCards = [
        { title: 'Total Campaigns', value: stats?.campaigns?.total || 0, icon: FolderKanban, color: '#2563EB', link: '/campaigns' },
        { title: 'Active Campaigns', value: stats?.campaigns?.active || 0, icon: TrendingUp, color: '#10B981', link: '/campaigns?status=active' },
        { title: 'Total Assets', value: stats?.assets?.total || 0, icon: Image, color: '#F59E0B', link: '/assets' },
        { title: 'Pending Approvals', value: stats?.approvals?.pending || 0, icon: Clock, color: '#EF4444', link: '/approvals' },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome back! Here's what's happening with your campaigns.</p>
            </div>

            <div className="grid grid-4">
                {statCards.map((stat) => (
                    <Link key={stat.title} to={stat.link} style={{ textDecoration: 'none' }}>
                        <div className="card">
                            <div className="flex justify-between items-center mb-md">
                                <h3 className="text-sm text-gray-600">{stat.title}</h3>
                                <stat.icon size={24} style={{ color: stat.color }} />
                            </div>
                            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-2 mt-xl">
                <div className="card">
                    <h2 className="text-xl font-semibold mb-md">Quick Actions</h2>
                    <div className="flex flex-col gap-sm">
                        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">Create Campaign</button>
                        <Link to="/assets" className="btn btn-secondary">Upload Asset</Link>
                        <Link to="/ai" className="btn btn-secondary">Generate with AI</Link>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-semibold mb-md">Recent Activity</h2>
                    <div className="text-gray-500 text-sm">No recent activity</div>
                </div>
            </div>

            <CreateCampaignModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}
