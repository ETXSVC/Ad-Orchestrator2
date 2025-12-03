import { useState, useEffect } from 'react';
import { approvalsAPI } from '../api/client';
import { useApp } from '../contexts/AppContext';
import ApprovalList from '../components/Approvals/ApprovalList';
import ApprovalDetailModal from '../components/Approvals/ApprovalDetailModal';

export default function Approvals() {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApproval, setSelectedApproval] = useState(null);
    const { showToast } = useApp();

    useEffect(() => {
        loadApprovals();
    }, []);

    const loadApprovals = async () => {
        try {
            setLoading(true);
            const response = await approvalsAPI.getQueue({ status: 'pending' });
            setApprovals(response.data.approvals);
        } catch (error) {
            console.error('Failed to load approvals:', error);
            showToast('Failed to load approval queue', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, comments) => {
        try {
            await approvalsAPI.approve(id, comments);
            showToast('Item approved successfully', 'success');
            loadApprovals();
        } catch (error) {
            console.error('Approval failed:', error);
            showToast(error.response?.data?.error || 'Failed to approve item', 'error');
            throw error;
        }
    };

    const handleReject = async (id, comments, reason) => {
        try {
            await approvalsAPI.reject(id, { comments, rejection_reason: reason });
            showToast('Item rejected', 'success');
            loadApprovals();
        } catch (error) {
            console.error('Rejection failed:', error);
            showToast(error.response?.data?.error || 'Failed to reject item', 'error');
            throw error;
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Approvals</h1>
                <p className="page-subtitle">Review and approve pending items</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
                </div>
            ) : (
                <ApprovalList
                    approvals={approvals}
                    onSelect={setSelectedApproval}
                />
            )}

            <ApprovalDetailModal
                isOpen={!!selectedApproval}
                onClose={() => setSelectedApproval(null)}
                approval={selectedApproval}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
}
