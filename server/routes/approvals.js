import express from 'express';
import { queryOne, queryAll, execute, transaction } from '../db/database.js';

const router = express.Router();

/**
 * GET /api/approvals/queue
 * Get approval queue with optional filters
 */
router.get('/queue', (req, res) => {
    try {
        const { status, priority } = req.query;

        let sql = `
      SELECT a.*, 
             ast.original_name as asset_name, ast.url as asset_url,
             c.title as campaign_title,
             u.name as submitted_by_name
      FROM approvals a
      LEFT JOIN assets ast ON a.asset_id = ast.id
      LEFT JOIN campaigns c ON a.campaign_id = c.id
      LEFT JOIN users u ON a.submitted_by = u.id
      WHERE 1=1
    `;
        const params = [];

        if (status) {
            sql += ' AND a.status = ?';
            params.push(status);
        }

        if (priority) {
            sql += ' AND a.priority = ?';
            params.push(priority);
        }

        sql += ' ORDER BY a.priority DESC, a.created_at ASC';

        const approvals = queryAll(sql, params);

        // Get approval steps for each
        approvals.forEach(approval => {
            const steps = queryAll(`
        SELECT s.*, u.name as approver_name
        FROM approval_steps s
        LEFT JOIN users u ON s.approver_id = u.id
        WHERE s.approval_id = ?
        ORDER BY s.step_number
      `, [approval.id]);
            approval.steps = steps;
        });

        res.json({ approvals });
    } catch (error) {
        console.error('Get approval queue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/approvals
 * Create new approval workflow
 */
router.post('/', (req, res) => {
    try {
        const { asset_id, campaign_id, workflow_type = 'sequential', approvers, sla_hours, priority = 'normal' } = req.body;

        if (!approvers || approvers.length === 0) {
            return res.status(400).json({ error: 'At least one approver is required' });
        }

        transaction(() => {
            // Calculate SLA deadline
            let sla_deadline = null;
            if (sla_hours) {
                const deadline = new Date();
                deadline.setHours(deadline.getHours() + sla_hours);
                sla_deadline = deadline.toISOString();
            }

            // Create approval
            const result = execute(`
        INSERT INTO approvals (asset_id, campaign_id, workflow_type, status, current_step, total_steps, sla_deadline, priority, submitted_by)
        VALUES (?, ?, ?, 'pending', 0, ?, ?, ?, ?)
      `, [asset_id || null, campaign_id || null, workflow_type, approvers.length, sla_deadline, priority, req.user.id]);

            const approvalId = result.lastInsertRowid;

            // Create approval steps
            approvers.forEach((approverId, index) => {
                execute(`
          INSERT INTO approval_steps (approval_id, step_number, approver_id, status)
          VALUES (?, ?, ?, 'pending')
        `, [approvalId, index, approverId]);
            });

            return approvalId;
        });

        const approval = queryOne('SELECT * FROM approvals WHERE id = (SELECT MAX(id) FROM approvals)');

        res.status(201).json({ approval });
    } catch (error) {
        console.error('Create approval error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/approvals/:id/approve
 * Approve an item
 */
router.post('/:id/approve', (req, res) => {
    try {
        const { comments } = req.body;

        const approval = queryOne('SELECT * FROM approvals WHERE id = ?', [req.params.id]);

        if (!approval) {
            return res.status(404).json({ error: 'Approval not found' });
        }

        transaction(() => {
            // Find current step for this user
            const step = queryOne(`
        SELECT * FROM approval_steps 
        WHERE approval_id = ? AND approver_id = ? AND status = 'pending'
        ORDER BY step_number
        LIMIT 1
      `, [req.params.id, req.user.id]);

            if (!step) {
                return res.status(403).json({ error: 'You are not an approver for this item or it has already been reviewed' });
            }

            // Update step
            execute(`
        UPDATE approval_steps 
        SET status = 'approved', comments = ?, reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [comments || null, step.id]);

            // Check if all steps are complete
            const pendingSteps = queryOne(`
        SELECT COUNT(*) as count FROM approval_steps
        WHERE approval_id = ? AND status = 'pending'
      `, [req.params.id]);

            if (pendingSteps.count === 0) {
                // All approved - update approval and asset status
                execute(`
          UPDATE approvals 
          SET status = 'approved', completed_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [req.params.id]);

                if (approval.asset_id) {
                    execute('UPDATE assets SET status = \'approved\' WHERE id = ?', [approval.asset_id]);
                }
            } else {
                // Move to next step
                execute('UPDATE approvals SET current_step = current_step + 1 WHERE id = ?', [req.params.id]);
            }
        });

        const updatedApproval = queryOne('SELECT * FROM approvals WHERE id = ?', [req.params.id]);

        res.json({ approval: updatedApproval, message: 'Approved successfully' });
    } catch (error) {
        console.error('Approve error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/approvals/:id/reject
 * Reject an item
 */
router.post('/:id/reject', (req, res) => {
    try {
        const { comments, rejection_reason } = req.body;

        const approval = queryOne('SELECT * FROM approvals WHERE id = ?', [req.params.id]);

        if (!approval) {
            return res.status(404).json({ error: 'Approval not found' });
        }

        transaction(() => {
            // Find current step for this user
            const step = queryOne(`
        SELECT * FROM approval_steps 
        WHERE approval_id = ? AND approver_id = ? AND status = 'pending'
        ORDER BY step_number
        LIMIT 1
      `, [req.params.id, req.user.id]);

            if (!step) {
                return res.status(403).json({ error: 'You are not an approver for this item or it has already been reviewed' });
            }

            // Update step
            execute(`
        UPDATE approval_steps 
        SET status = 'rejected', comments = ?, rejection_reason = ?, reviewed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [comments || null, rejection_reason || null, step.id]);

            // Update approval status
            execute(`
        UPDATE approvals 
        SET status = 'rejected', completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [req.params.id]);

            // Update asset status
            if (approval.asset_id) {
                execute('UPDATE assets SET status = \'rejected\' WHERE id = ?', [approval.asset_id]);
            }
        });

        const updatedApproval = queryOne('SELECT * FROM approvals WHERE id = ?', [req.params.id]);

        res.json({ approval: updatedApproval, message: 'Rejected successfully' });
    } catch (error) {
        console.error('Reject error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/approvals/bulk-approve
 * Bulk approve multiple items
 */
router.post('/bulk-approve', (req, res) => {
    try {
        const { approval_ids, comments } = req.body;

        if (!approval_ids || !Array.isArray(approval_ids) || approval_ids.length === 0) {
            return res.status(400).json({ error: 'approval_ids array is required' });
        }

        const results = [];

        approval_ids.forEach(id => {
            try {
                const approval = queryOne('SELECT * FROM approvals WHERE id = ?', [id]);
                if (approval) {
                    // Similar logic to single approve
                    const step = queryOne(`
            SELECT * FROM approval_steps 
            WHERE approval_id = ? AND approver_id = ? AND status = 'pending'
            ORDER BY step_number
            LIMIT 1
          `, [id, req.user.id]);

                    if (step) {
                        execute(`
              UPDATE approval_steps 
              SET status = 'approved', comments = ?, reviewed_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `, [comments || null, step.id]);

                        results.push({ id, status: 'approved' });
                    }
                }
            } catch (e) {
                results.push({ id, status: 'error', error: e.message });
            }
        });

        res.json({ results });
    } catch (error) {
        console.error('Bulk approve error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/approvals/:id/history
 * Get approval history
 */
router.get('/:id/history', (req, res) => {
    try {
        const steps = queryAll(`
      SELECT s.*, u.name as approver_name
      FROM approval_steps s
      LEFT JOIN users u ON s.approver_id = u.id
      WHERE s.approval_id = ?
      ORDER BY s.step_number
    `, [req.params.id]);

        res.json({ history: steps });
    } catch (error) {
        console.error('Get approval history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
