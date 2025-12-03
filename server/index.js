import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, seedDatabase } from './db/database.js';
import { authenticate } from './middleware/auth.js';

// Import routes
import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import assetRoutes from './routes/assets.js';
import userRoutes from './routes/users.js';
import approvalRoutes from './routes/approvals.js';
import aiRoutes from './routes/ai.js';
import dashboardRoutes from './routes/dashboard.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
console.log('Initializing database...');
initDatabase();
seedDatabase();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication required)
app.use('/api/campaigns', authenticate, campaignRoutes);
app.use('/api/assets', authenticate, assetRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/approvals', authenticate, approvalRoutes);
app.use('/api/ai', authenticate, aiRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Ad-Orchestrator API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            campaigns: '/api/campaigns',
            assets: '/api/assets',
            users: '/api/users',
            approvals: '/api/approvals',
            ai: '/api/ai',
            dashboard: '/api/dashboard',
            health: '/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Ad-Orchestrator API Server is running!');
    console.log('');
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Health:  http://localhost:${PORT}/health`);
    console.log('');
    console.log('📚 API Endpoints:');
    console.log(`   Auth:      POST   /api/auth/login`);
    console.log(`   Campaigns: GET    /api/campaigns`);
    console.log(`   Assets:    POST   /api/assets/upload`);
    console.log(`   Users:     GET    /api/users`);
    console.log(`   Approvals: GET    /api/approvals/queue`);
    console.log(`   AI:        POST   /api/ai/generate/text`);
    console.log(`   Dashboard: GET    /api/dashboard/stats`);
    console.log('');
    console.log('🔐 Default Admin Credentials:');
    console.log('   Email:    admin@adorch.local');
    console.log('   Password: admin123');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    process.exit(0);
});
