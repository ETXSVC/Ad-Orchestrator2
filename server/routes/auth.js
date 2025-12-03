import express from 'express';
import bcrypt from 'bcryptjs';
import { queryOne, execute } from '../db/database.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = queryOne('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Account is not active' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user);

        // Return user data (without password hash) and token
        const { password_hash, ...userData } = user;

        res.json({
            user: userData,
            token,
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/auth/register
 * Register new user (admin only in production)
 */
router.post('/register', async (req, res) => {
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

        const user = queryOne('SELECT id, email, name, role, department, status FROM users WHERE id = ?', [result.lastInsertRowid]);

        res.status(201).json({ user });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/auth/me
 * Get current user (requires authentication)
 */
router.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({ user: req.user });
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

export default router;
