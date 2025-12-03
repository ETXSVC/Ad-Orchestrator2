import { useState, useEffect } from 'react';
import { X, Download, Trash2 } from 'lucide-react';

export default function AssetDetailModal({ asset, isOpen, onClose, onUpdate, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        keywords: ''
    });
    const [loading, setLoading] = useState(false);

    // Pre-populate form when asset changes
    useEffect(() => {
        if (asset) {
            setFormData({
                title: asset.metadata?.title || asset.original_name || '',
                description: asset.metadata?.description || '',
                tags: asset.metadata?.tags?.join(', ') || '',
                keywords: asset.metadata?.keywords?.join(', ') || ''
            });
        }
    }, [asset]);

    if (!isOpen || !asset) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const { assetsAPI } = await import('../../api/client');

            const updatedMetadata = {
                title: formData.title,
                description: formData.description,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
                keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
            };

            await assetsAPI.update(asset.id, { metadata: updatedMetadata });
            onUpdate();
            setEditing(false);
        } catch (error) {
            console.error('Failed to update asset:', error);
            alert('Failed to update asset');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this asset?')) return;

        setLoading(true);
        try {
            const { assetsAPI } = await import('../../api/client');
            await assetsAPI.delete(asset.id);
            onDelete();
            onClose();
        } catch (error) {
            console.error('Failed to delete asset:', error);
            alert('Failed to delete asset');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        window.open(`http://localhost:3000/api/assets/${asset.id}/download`, '_blank');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">Asset Details</h2>
                    <button onClick={onClose} className="btn-ghost" style={{ padding: '0.5rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                        {/* Image Preview */}
                        <div>
                            <div style={{
                                width: '100%',
                                height: '300px',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                                backgroundColor: '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {asset.type === 'image' ? (
                                    <img
                                        src={`http://localhost:3000${asset.url}`}
                                        alt={asset.metadata?.title || asset.original_name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📄</div>
                                        <p className="text-gray-600">{asset.type}</p>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <p className="text-sm text-gray-600 mb-xs">
                                    <strong>Filename:</strong> {asset.original_name}
                                </p>
                                <p className="text-sm text-gray-600 mb-xs">
                                    <strong>Size:</strong> {(asset.size / 1024).toFixed(2)} KB
                                </p>
                                <p className="text-sm text-gray-600 mb-xs">
                                    <strong>Type:</strong> {asset.mime_type}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Uploaded:</strong> {new Date(asset.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Metadata Form */}
                        <div>
                            {editing ? (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Title</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="input"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="3"
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Keywords (comma-separated)</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.keywords}
                                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-md">
                                        <p className="text-sm font-semibold text-gray-700 mb-xs">Title</p>
                                        <p className="text-sm text-gray-600">{formData.title || '-'}</p>
                                    </div>

                                    <div className="mb-md">
                                        <p className="text-sm font-semibold text-gray-700 mb-xs">Description</p>
                                        <p className="text-sm text-gray-600">{formData.description || '-'}</p>
                                    </div>

                                    <div className="mb-md">
                                        <p className="text-sm font-semibold text-gray-700 mb-xs">Tags (comma-separated)</p>
                                        <p className="text-sm text-gray-600">{formData.tags || '-'}</p>
                                    </div>

                                    <div className="mb-md">
                                        <p className="text-sm font-semibold text-gray-700 mb-xs">Keywords (comma-separated)</p>
                                        <p className="text-sm text-gray-600">{formData.keywords || '-'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                    <button onClick={handleDelete} className="btn btn-danger" disabled={loading}>
                        <Trash2 size={18} />
                        Delete
                    </button>

                    <div className="flex gap-sm">
                        <button onClick={handleDownload} className="btn btn-secondary">
                            <Download size={18} />
                            Download
                        </button>

                        {editing ? (
                            <>
                                <button onClick={() => setEditing(false)} className="btn btn-secondary" disabled={loading}>
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setEditing(true)} className="btn btn-primary">
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
