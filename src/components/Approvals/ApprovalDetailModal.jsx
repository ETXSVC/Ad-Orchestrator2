import { useState } from 'react';
import { X, Check, AlertTriangle, FileText, Image as ImageIcon } from 'lucide-react';

export default function ApprovalDetailModal({ isOpen, onClose, approval, onApprove, onReject }) {
    const [comments, setComments] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [action, setAction] = useState(null); // 'approve' or 'reject'
    const [loading, setLoading] = useState(false);

    if (!isOpen || !approval) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (action === 'approve') {
                await onApprove(approval.id, comments);
            } else if (action === 'reject') {
                await onReject(approval.id, comments, rejectionReason);
            }
            onClose();
        } catch (error) {
            console.error('Action failed:', error);
        } finally {
            setLoading(false);
            setAction(null);
            setComments('');
            setRejectionReason('');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">Review Item</h2>
                    <button className="btn btn-ghost" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="flex gap-md mb-lg">
                        <div style={{
                            width: '120px',
                            height: '120px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {approval.asset_url ? (
                                <img
                                    src={`http://localhost:3000${approval.asset_url}`}
                                    alt="Asset preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <FileText size={40} className="text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-xs">
                                {approval.asset_name || approval.campaign_title || 'Untitled Item'}
                            </h3>
                            <div className="flex gap-sm mb-md">
                                <span className="badge badge-gray">{approval.asset_id ? 'Asset' : 'Campaign'}</span>
                                <span className="badge badge-info">{approval.priority} Priority</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>Submitted by:</strong> {approval.submitted_by_name}</p>
                                <p><strong>Date:</strong> {new Date(approval.created_at).toLocaleDateString()}</p>
                                {approval.sla_deadline && (
                                    <p className="text-warning">
                                        <strong>SLA Deadline:</strong> {new Date(approval.sla_deadline).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {!action ? (
                        <div className="flex gap-md justify-end mt-xl">
                            <button
                                className="btn btn-danger"
                                onClick={() => setAction('reject')}
                            >
                                <X size={18} />
                                Reject
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => setAction('approve')}
                            >
                                <Check size={18} />
                                Approve
                            </button>
                        </div>
                    ) : (
                        <div className="mt-lg p-md bg-gray-50 rounded border border-gray-200">
                            <h4 className="font-semibold mb-md flex items-center gap-sm">
                                {action === 'approve' ? (
                                    <><Check size={18} className="text-success" /> Confirm Approval</>
                                ) : (
                                    <><AlertTriangle size={18} className="text-error" /> Confirm Rejection</>
                                )}
                            </h4>

                            {action === 'reject' && (
                                <div className="form-group">
                                    <label className="form-label">Rejection Reason *</label>
                                    <select
                                        className="input"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a reason...</option>
                                        <option value="quality">Quality Issues</option>
                                        <option value="guidelines">Brand Guidelines Violation</option>
                                        <option value="content">Inappropriate Content</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Comments (Optional)</label>
                                <textarea
                                    className="input"
                                    rows="3"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    placeholder="Add any feedback..."
                                />
                            </div>

                            <div className="flex gap-sm justify-end mt-md">
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => setAction(null)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`btn ${action === 'approve' ? 'btn-primary' : 'btn-danger'}`}
                                    onClick={handleSubmit}
                                    disabled={loading || (action === 'reject' && !rejectionReason)}
                                >
                                    {loading ? 'Processing...' : (action === 'approve' ? 'Confirm Approve' : 'Confirm Reject')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
