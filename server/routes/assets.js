import express from 'express';
import { queryOne, queryAll, execute } from '../db/database.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

/**
 * GET /api/assets
 * List all assets with optional filters
 */
router.get('/', (req, res) => {
    try {
        const { type, status, campaign_id, search } = req.query;

        let sql = 'SELECT a.*, u.name as uploader_name, c.title as campaign_title FROM assets a LEFT JOIN users u ON a.user_id = u.id LEFT JOIN campaigns c ON a.campaign_id = c.id WHERE 1=1';
        const params = [];

        if (type) {
            sql += ' AND a.type = ?';
            params.push(type);
        }

        if (status) {
            sql += ' AND a.status = ?';
            params.push(status);
        }

        if (campaign_id) {
            sql += ' AND a.campaign_id = ?';
            params.push(campaign_id);
        }

        if (search) {
            sql += ' AND (a.original_name LIKE ? OR a.metadata LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' ORDER BY a.created_at DESC';

        const assets = queryAll(sql, params);

        // Parse JSON metadata
        assets.forEach(asset => {
            try {
                asset.metadata = asset.metadata ? JSON.parse(asset.metadata) : {};
            } catch (e) {
                asset.metadata = {};
            }
        });

        res.json({ assets });
    } catch (error) {
        console.error('Get assets error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/assets/upload
 * Upload new asset
 */
router.post('/upload', uploadSingle, handleUploadError, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { campaign_id, title, description, tags, keywords } = req.body;

        // Determine asset type from MIME type
        let type = 'document';
        if (req.file.mimetype.startsWith('image/')) {
            type = 'image';
        } else if (req.file.mimetype.startsWith('video/')) {
            type = 'video';
        }

        // Build metadata
        const metadata = {
            title: title || req.file.originalname,
            description: description || '',
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            keywords: keywords ? keywords.split(',').map(k => k.trim()) : []
        };

        // Insert asset record
        const result = execute(`
      INSERT INTO assets (filename, original_name, url, type, mime_type, size, metadata, campaign_id, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            req.file.filename,
            req.file.originalname,
            `/uploads/${req.file.filename}`,
            type,
            req.file.mimetype,
            req.file.size,
            JSON.stringify(metadata),
            campaign_id || null,
            'uploaded',
            req.user.id
        ]);

        const asset = queryOne('SELECT * FROM assets WHERE id = ?', [result.lastInsertRowid]);
        asset.metadata = JSON.parse(asset.metadata);

        res.status(201).json({ asset });
    } catch (error) {
        console.error('Upload asset error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/assets/:id
 * Get asset by ID
 */
router.get('/:id', (req, res) => {
    try {
        const asset = queryOne('SELECT a.*, u.name as uploader_name FROM assets a LEFT JOIN users u ON a.user_id = u.id WHERE a.id = ?', [req.params.id]);

        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        // Parse metadata
        try {
            asset.metadata = asset.metadata ? JSON.parse(asset.metadata) : {};
        } catch (e) {
            asset.metadata = {};
        }

        res.json({ asset });
    } catch (error) {
        console.error('Get asset error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PUT /api/assets/:id
 * Update asset metadata
 */
router.put('/:id', (req, res) => {
    try {
        const asset = queryOne('SELECT * FROM assets WHERE id = ?', [req.params.id]);

        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        const { campaign_id, status, metadata } = req.body;

        console.log('Updating asset', req.params.id, 'with metadata:', metadata);

        execute(`
      UPDATE assets 
      SET campaign_id = ?, status = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
            campaign_id !== undefined ? campaign_id : asset.campaign_id,
            status !== undefined ? status : asset.status,
            metadata ? JSON.stringify(metadata) : asset.metadata,
            req.params.id
        ]);

        const updatedAsset = queryOne('SELECT * FROM assets WHERE id = ?', [req.params.id]);

        // Parse metadata if it's a string
        try {
            updatedAsset.metadata = typeof updatedAsset.metadata === 'string'
                ? JSON.parse(updatedAsset.metadata)
                : updatedAsset.metadata;
        } catch (e) {
            console.error('Error parsing metadata:', e);
            updatedAsset.metadata = {};
        }

        console.log('Updated asset metadata:', updatedAsset.metadata);

        res.json({ asset: updatedAsset });
    } catch (error) {
        console.error('Update asset error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * DELETE /api/assets/:id
 * Delete asset
 */
router.delete('/:id', (req, res) => {
    try {
        const asset = queryOne('SELECT * FROM assets WHERE id = ?', [req.params.id]);

        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        // Delete physical file
        const uploadDir = process.env.UPLOAD_DIR || join(__dirname, '../uploads');
        const filePath = join(uploadDir, asset.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete database record
        execute('DELETE FROM assets WHERE id = ?', [req.params.id]);

        res.json({ message: 'Asset deleted successfully' });
    } catch (error) {
        console.error('Delete asset error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/assets/:id/download
 * Download asset file
 */
router.get('/:id/download', (req, res) => {
    try {
        const asset = queryOne('SELECT * FROM assets WHERE id = ?', [req.params.id]);

        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        const uploadDir = process.env.UPLOAD_DIR || join(__dirname, '../uploads');
        const filePath = join(uploadDir, asset.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(filePath, asset.original_name);
    } catch (error) {
        console.error('Download asset error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
