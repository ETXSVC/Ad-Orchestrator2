import { useState, useEffect } from 'react';
import { assetsAPI } from '../api/client';
import { Plus, Upload } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import UploadAssetModal from '../components/Assets/UploadAssetModal';
import AssetDetailModal from '../components/Assets/AssetDetailModal';

export default function Assets() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const { showToast } = useApp();

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        try {
            const response = await assetsAPI.list();
            setAssets(response.data.assets);
        } catch (error) {
            console.error('Failed to load assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSuccess = () => {
        showToast('Asset uploaded successfully!', 'success');
        loadAssets();
    };

    const handleAssetUpdate = () => {
        showToast('Asset updated successfully!', 'success');
        loadAssets();
    };

    const handleAssetDelete = () => {
        showToast('Asset deleted successfully!', 'success');
        loadAssets();
    };

    return (
        <div>
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Assets</h1>
                    <p className="page-subtitle">Manage your media assets</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                    <Upload size={18} />
                    Upload Asset
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
                </div>
            ) : assets.length === 0 ? (
                <div className="empty-state">
                    <p className="text-lg font-semibold mb-sm">No assets yet</p>
                    <p className="text-gray-500 mb-lg">Upload your first asset to get started</p>
                    <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                        <Upload size={18} />
                        Upload Asset
                    </button>
                </div>
            ) : (
                <div className="grid grid-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="card"
                            onClick={() => setSelectedAsset(asset)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{
                                height: '160px',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                backgroundColor: '#f3f4f6'
                            }}>
                                {asset.type === 'image' ? (
                                    <img
                                        src={`http://localhost:3000${asset.url}`}
                                        alt={asset.metadata?.title || asset.original_name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<span class="text-gray-400 text-sm">Image</span>';
                                        }}
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">{asset.type}</span>
                                )}
                            </div>
                            <h4 className="font-semibold text-sm mb-xs">{asset.metadata?.title || asset.original_name}</h4>
                            <p className="text-xs text-gray-500">{(asset.size / 1024).toFixed(1)} KB</p>
                        </div>
                    ))}
                </div>
            )}

            <UploadAssetModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSuccess={handleUploadSuccess}
            />

            <AssetDetailModal
                asset={selectedAsset}
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                onUpdate={handleAssetUpdate}
                onDelete={handleAssetDelete}
            />
        </div>
    );
}
