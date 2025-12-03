import { useState } from 'react';
import { X, Upload } from 'lucide-react';

export default function UploadAssetModal({ isOpen, onClose, onSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        keywords: '',
        campaign_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        setLoading(true);

        try {
            const { assetsAPI } = await import('../../api/client');

            const uploadFormData = new FormData();
            uploadFormData.append('file', selectedFile);
            uploadFormData.append('title', formData.title || selectedFile.name);
            uploadFormData.append('description', formData.description);
            uploadFormData.append('tags', formData.tags);
            uploadFormData.append('keywords', formData.keywords);
            if (formData.campaign_id) {
                uploadFormData.append('campaign_id', formData.campaign_id);
            }

            await assetsAPI.upload(uploadFormData);
            onSuccess();
            onClose();

            // Reset form
            setSelectedFile(null);
            setFormData({
                title: '',
                description: '',
                tags: '',
                keywords: '',
                campaign_id: ''
            });
        } catch (error) {
            console.error('Failed to upload asset:', error);
            alert('Failed to upload asset. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Upload Asset</h2>
                    <button onClick={onClose} className="btn-ghost" style={{ padding: '0.5rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div
                            className="form-group"
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <label className="form-label">File *</label>
                            <div
                                style={{
                                    border: `2px dashed ${dragActive ? '#2563EB' : '#D1D5DB'}`,
                                    borderRadius: '0.5rem',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    backgroundColor: dragActive ? '#EFF6FF' : '#F9FAFB',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => document.getElementById('file-input').click()}
                            >
                                <Upload size={32} style={{ margin: '0 auto 1rem', color: '#6B7280' }} />
                                {selectedFile ? (
                                    <div>
                                        <p className="font-semibold">{selectedFile.name}</p>
                                        <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="font-semibold">Drop file here or click to browse</p>
                                        <p className="text-sm text-gray-500">Supported: Images, Videos, PDFs (Max 10MB)</p>
                                    </div>
                                )}
                                <input
                                    id="file-input"
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/*,video/*,.pdf,.doc,.docx"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder={selectedFile ? selectedFile.name : "Asset title"}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="input"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Asset description..."
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
                                placeholder="summer, sale, promotional"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Keywords (comma-separated)</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                placeholder="beach, vacation, travel"
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
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Upload Asset
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
