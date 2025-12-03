import { useState, useEffect } from 'react';
import { campaignsAPI } from '../api/client';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import CreateCampaignModal from '../components/Campaigns/CreateCampaignModal';

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { showToast } = useApp();

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            const response = await campaignsAPI.list();
            setCampaigns(response.data.campaigns);
        } catch (error) {
            console.error('Failed to load campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        showToast('Campaign created successfully!', 'success');
        loadCampaigns();
    };

    const filteredCampaigns = campaigns.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.client && c.client.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusColor = (status) => {
        const colors = {
            active: 'success',
            draft: 'gray',
            paused: 'warning',
            completed: 'info',
            archived: 'error'
        };
        return colors[status] || 'gray';
    };

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Campaigns</h1>
                    <p className="page-subtitle">Manage your advertising campaigns</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <Plus size={18} />
                    Create Campaign
                </button>
            </div>

            <div className="card mb-lg">
                <div className="flex gap-md items-center">
                    <Search size={18} />
                    <input
                        type="text"
                        className="input"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <div className="empty-state">
                    <p className="text-lg font-semibold mb-sm">No campaigns found</p>
                    <p className="text-gray-500 mb-lg">Create your first campaign to get started</p>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} />
                        Create Campaign
                    </button>
                </div>
            ) : (
                <div className="grid grid-3">
                    {filteredCampaigns.map((campaign) => (
                        <div key={campaign.id} className="card">
                            <div className="flex justify-between items-start mb-md">
                                <h3 className="font-semibold">{campaign.title}</h3>
                                <span className={`badge badge-${getStatusColor(campaign.status)}`}>
                                    {campaign.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-md">{campaign.description || 'No description'}</p>
                            {campaign.client && (
                                <p className="text-xs text-gray-500">Client: {campaign.client}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <CreateCampaignModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}
