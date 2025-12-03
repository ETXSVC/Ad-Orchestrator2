import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react';

export default function ApprovalList({ approvals, onSelect }) {
    if (!approvals || approvals.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <Clock size={48} />
                </div>
                <h3 className="text-lg font-semibold mb-sm">No pending approvals</h3>
                <p className="text-gray-500">You're all caught up!</p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="badge badge-success">Approved</span>;
            case 'rejected': return <span className="badge badge-error">Rejected</span>;
            case 'pending': return <span className="badge badge-warning">Pending</span>;
            default: return <span className="badge badge-gray">{status}</span>;
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'urgent': return <span className="badge badge-error">Urgent</span>;
            case 'high': return <span className="badge badge-warning">High</span>;
            default: return <span className="badge badge-info">Normal</span>;
        }
    };

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-gray-200)', backgroundColor: 'var(--color-gray-50)' }}>
                        <th className="text-left p-md text-sm font-semibold text-gray-600">Item</th>
                        <th className="text-left p-md text-sm font-semibold text-gray-600">Type</th>
                        <th className="text-left p-md text-sm font-semibold text-gray-600">Submitted By</th>
                        <th className="text-left p-md text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left p-md text-sm font-semibold text-gray-600">Priority</th>
                        <th className="text-left p-md text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-right p-md text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {approvals.map((approval) => (
                        <tr key={approval.id} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                            <td className="p-md">
                                <div className="font-medium">{approval.asset_name || approval.campaign_title || 'Untitled Item'}</div>
                                {approval.asset_url && (
                                    <div className="text-xs text-gray-500 mt-xs">Asset ID: {approval.asset_id}</div>
                                )}
                            </td>
                            <td className="p-md">
                                <span className="text-sm text-gray-600">
                                    {approval.asset_id ? 'Asset' : 'Campaign'}
                                </span>
                            </td>
                            <td className="p-md">
                                <div className="text-sm">{approval.submitted_by_name || 'Unknown'}</div>
                            </td>
                            <td className="p-md">
                                <div className="text-sm text-gray-600">
                                    {format(new Date(approval.created_at), 'MMM d, yyyy')}
                                </div>
                            </td>
                            <td className="p-md">
                                {getPriorityBadge(approval.priority)}
                            </td>
                            <td className="p-md">
                                {getStatusBadge(approval.status)}
                            </td>
                            <td className="p-md text-right">
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => onSelect(approval)}
                                >
                                    <Eye size={14} />
                                    Review
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
