import jwt from 'jsonwebtoken';
import { queryOne } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

/**
 * Generate JWT token for user
 */
export function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Authentication middleware
 * Protects routes - requires valid JWT token
 */
export function authenticate(req, res, next) {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get full user details from database
    const user = queryOne('SELECT id, email, name, role, department, status FROM users WHERE id = ?', [decoded.id]);

    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    if (user.status !== 'active') {
        return res.status(403).json({ error: 'User account is not active' });
    }

    // Attach user to request object
    req.user = user;
    next();
}

/**
 * Authorization middleware
 * Checks if user has required role
 */
export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}

/**
 * Optional authentication
 * Adds user to req if token is valid, but doesn't block if missing
 */
export function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (decoded) {
            const user = queryOne('SELECT id, email, name, role, department FROM users WHERE id = ?', [decoded.id]);
            if (user && user.status === 'active') {
                req.user = user;
            }
        }
    }

    next();
}
