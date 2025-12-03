import { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        client: '',
        status: 'draft',
        channels: [],
        target_audience: '',
        brand_voice: '',
        budget: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { campaignsAPI } = await import('../../api/client');
            await campaignsAPI.create(formData);
            onSuccess();
            onClose();
            setFormData({
                title: '',
                description: '',
                client: '',
                status: 'draft',
                channels: [],
                target_audience: '',
                brand_voice: '',
                budget: ''
            });
        } catch (error) {
            console.error('Failed to create campaign:', error);
            alert('Failed to create campaign. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Create New Campaign</h2>
                    <button onClick={onClose} className="btn-ghost" style={{ padding: '0.5rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Campaign Title *</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Summer Sale 2024"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="input"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Campaign description..."
                                rows="3"
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Client</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                placeholder="Client name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="input"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Target Audience</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.target_audience}
                                onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                                placeholder="e.g., Millennials, 25-34"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Brand Voice</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.brand_voice}
                                onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
                                placeholder="e.g., Professional, Friendly"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Budget ($)</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                placeholder="10000"
                                min="0"
                                step="100"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Campaign'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
