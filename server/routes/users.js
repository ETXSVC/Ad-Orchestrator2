import express from 'express';
import bcrypt from 'bcryptjs';
import { queryOne, queryAll, execute } from '../db/database.js';

const router = express.Router();

/**
 * GET /api/users
 * List all users with optional filters
 */
router.get('/', (req, res) => {
    try {
        const { role, status, department, search } = req.query;

        let sql = 'SELECT id, email, name, role, department, status, avatar, created_at FROM users WHERE 1=1';
        const params = [];

        if (role) {
            sql += ' AND role = ?';
            params.push(role);
        }

        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }

        if (department) {
            sql += ' AND department = ?';
            params.push(department);
        }

        if (search) {
            sql += ' AND (name LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' ORDER BY created_at DESC';

        const users = queryAll(sql, params);

        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/users
 * Create new user/team member
 */
router.post('/', async (req, res) => {
    try {
        const { email, password, name, role = 'user', department } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Check if user already exists
        const existingUser = queryOne('SELECT id FROM users WHERE email = ?', [email]);

        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const result = execute(`
      INSERT INTO users (email, password_hash, name, role, department, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `, [email, passwordHash, name, role, department || null]);

        const user = queryOne('SELECT id, email, name, role, department, status, created_at FROM users WHERE id = ?', [result.lastInsertRowid]);

        res.status(201).json({ user });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req, res) => {
    try {
        const user = queryOne('SELECT id, email, name, role, department, status, avatar, created_at FROM users WHERE id = ?', [req.params.id]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user's activity stats
        const campaignCount = queryOne('SELECT COUNT(*) as count FROM campaigns WHERE user_id = ?', [req.params.id]);
        const assetCount = queryOne('SELECT COUNT(*) as count FROM assets WHERE user_id = ?', [req.params.id]);

        user.stats = {
            campaigns: campaignCount.count,
            assets: assetCount.count
        };

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', (req, res) => {
    try {
        const user = queryOne('SELECT * FROM users WHERE id = ?', [req.params.id]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, role, department, status, avatar } = req.body;

        execute(`
      UPDATE users 
      SET name = ?, role = ?, department = ?, status = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
            name !== undefined ? name : user.name,
            role !== undefined ? role : user.role,
            department !== undefined ? department : user.department,
            status !== undefined ? status : user.status,
            avatar !== undefined ? avatar : user.avatar,
            req.params.id
        ]);

        const updatedUser = queryOne('SELECT id, email, name, role, department, status, avatar FROM users WHERE id = ?', [req.params.id]);

        res.json({ user: updatedUser });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * DELETE /api/users/:id
 * Delete/remove user
 */
router.delete('/:id', (req, res) => {
    try {
        // Don't allow deleting yourself
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const user = queryOne('SELECT * FROM users WHERE id = ?', [req.params.id]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        execute('DELETE FROM users WHERE id = ?', [req.params.id]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PATCH /api/users/:id/status
 * Activate or deactivate user
 */
router.patch('/:id/status', (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['active', 'inactive', 'suspended'].includes(status)) {
            return res.status(400).json({ error: 'Valid status is required (active, inactive, or suspended)' });
        }

        const user = queryOne('SELECT * FROM users WHERE id = ?', [req.params.id]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        execute('UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, req.params.id]);

        const updatedUser = queryOne('SELECT id, email, name, role, department, status FROM users WHERE id = ?', [req.params.id]);

        res.json({ user: updatedUser });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
