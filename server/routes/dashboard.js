import express from 'express';
import { getDashboardStats, getRecentActivity } from '../services/dashboardService.js';

const router = express.Router();

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
router.get('/stats', (req, res) => {
    try {
        const stats = getDashboardStats(req.user.id);

        if (!stats) {
            return res.status(500).json({ error: 'Failed to retrieve stats' });
        }

        res.json({ stats });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/dashboard/activity
 * Get recent activity
 */
router.get('/activity', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const activities = getRecentActivity(limit);

        res.json({ activities });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
