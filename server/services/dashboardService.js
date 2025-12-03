import { queryOne, queryAll } from '../db/database.js';

/**
 * Get dashboard statistics
 */
export function getDashboardStats(userId = null) {
    try {
        const stats = {
            campaigns: {},
            assets: {},
            approvals: {},
            users: {}
        };

        // Campaign stats
        stats.campaigns.total = queryOne('SELECT COUNT(*) as count FROM campaigns')?.count || 0;
        stats.campaigns.active = queryOne('SELECT COUNT(*) as count FROM campaigns WHERE status = \'active\'')?.count || 0;
        stats.campaigns.draft = queryOne('SELECT COUNT(*) as count FROM campaigns WHERE status = \'draft\'')?.count || 0;
        stats.campaigns.completed = queryOne('SELECT COUNT(*) as count FROM campaigns WHERE status = \'completed\'')?.count || 0;

        // Asset stats
        stats.assets.total = queryOne('SELECT COUNT(*) as count FROM assets')?.count || 0;
        stats.assets.images = queryOne('SELECT COUNT(*) as count FROM assets WHERE type = \'image\'')?.count || 0;
        stats.assets.videos = queryOne('SELECT COUNT(*) as count FROM assets WHERE type = \'video\'')?.count || 0;
        stats.assets.pending = queryOne('SELECT COUNT(*) as count FROM assets WHERE status = \'uploaded\'')?.count || 0;

        // Approval stats
        stats.approvals.pending = queryOne('SELECT COUNT(*) as count FROM approvals WHERE status = \'pending\'')?.count || 0;
        stats.approvals.approved = queryOne('SELECT COUNT(*) as count FROM approvals WHERE status = \'approved\'')?.count || 0;
        stats.approvals.rejected = queryOne('SELECT COUNT(*) as count FROM approvals WHERE status = \'rejected\'')?.count || 0;

        // SLA warnings (deadlines within 24 hours)
        const tomorrow = new Date();
        tomorrow.setHours(tomorrow.getHours() + 24);
        stats.approvals.sla_warnings = queryOne(`
      SELECT COUNT(*) as count FROM approvals 
      WHERE status = 'pending' AND sla_deadline IS NOT NULL AND sla_deadline < ?
    `, [tomorrow.toISOString()])?.count || 0;

        // User stats
        stats.users.total = queryOne('SELECT COUNT(*) as count FROM users')?.count || 0;
        stats.users.active = queryOne('SELECT COUNT(*) as count FROM users WHERE status = \'active\'')?.count || 0;

        return stats;
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return null;
    }
}

/**
 * Get recent activity
 */
export function getRecentActivity(limit = 10) {
    try {
        const activities = queryAll(`
      SELECT * FROM activity_log
      ORDER BY created_at DESC
      LIMIT ?
    `, [limit]);

        return activities;
    } catch (error) {
        console.error('Get recent activity error:', error);
        return [];
    }
}

/**
 * Log activity
 */
export function logActivity(userId, action, entityType, entityId, details = null) {
    try {
        import('../db/database.js').then(({ execute }) => {
            execute(`
        INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
        VALUES (?, ?, ?, ?, ?)
      `, [userId, action, entityType, entityId, details ? JSON.stringify(details) : null]);
        });
    } catch (error) {
        console.error('Log activity error:', error);
    }
}
