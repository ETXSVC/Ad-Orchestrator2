import express from 'express';
import { queryOne, queryAll, execute } from '../db/database.js';

const router = express.Router();

/**
 * GET /api/campaigns
 * List all campaigns with optional filters
 */
router.get('/', (req, res) => {
    try {
        const { status, client, search } = req.query;

        let sql = 'SELECT c.*, u.name as creator_name FROM campaigns c LEFT JOIN users u ON c.user_id = u.id WHERE 1=1';
        const params = [];

        if (status) {
            sql += ' AND c.status = ?';
            params.push(status);
        }

        if (client) {
            sql += ' AND c.client LIKE ?';
            params.push(`%${client}%`);
        }

        if (search) {
            sql += ' AND (c.title LIKE ? OR c.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' ORDER BY c.created_at DESC';

        const campaigns = queryAll(sql, params);

        // Parse JSON fields
        campaigns.forEach(campaign => {
            try {
                campaign.channels = campaign.channels ? JSON.parse(campaign.channels) : [];
            } catch (e) {
                campaign.channels = [];
            }
        });

        res.json({ campaigns });
    } catch (error) {
        console.error('Get campaigns error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/campaigns
 * Create new campaign
 */
router.post('/', (req, res) => {
    try {
        const { title, description, client, status = 'draft', channels, target_audience, brand_voice, budget, start_date, end_date } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = execute(`
      INSERT INTO campaigns (title, description, client, status, channels, target_audience, brand_voice, budget, start_date, end_date, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            title,
            description || null,
            client || null,
            status,
            channels ? JSON.stringify(channels) : null,
            target_audience || null,
            brand_voice || null,
            budget || null,
            start_date || null,
            end_date || null,
            req.user.id
        ]);

        const campaign = queryOne('SELECT * FROM campaigns WHERE id = ?', [result.lastInsertRowid]);

        res.status(201).json({ campaign });
    } catch (error) {
        console.error('Create campaign error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/campaigns/:id
 * Get campaign by ID
 */
router.get('/:id', (req, res) => {
    try {
        const campaign = queryOne('SELECT c.*, u.name as creator_name FROM campaigns c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = ?', [req.params.id]);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        // Parse JSON fields
        try {
            campaign.channels = campaign.channels ? JSON.parse(campaign.channels) : [];
        } catch (e) {
            campaign.channels = [];
        }

        // Get associated assets
        const assets = queryAll('SELECT * FROM assets WHERE campaign_id = ?', [req.params.id]);
        campaign.assets = assets;

        res.json({ campaign });
    } catch (error) {
        console.error('Get campaign error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PUT /api/campaigns/:id
 * Update campaign
 */
router.put('/:id', (req, res) => {
    try {
        const campaign = queryOne('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const { title, description, client, status, channels, target_audience, brand_voice, budget, start_date, end_date } = req.body;

        execute(`
      UPDATE campaigns 
      SET title = ?, description = ?, client = ?, status = ?, channels = ?, 
          target_audience = ?, brand_voice = ?, budget = ?, start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
            title !== undefined ? title : campaign.title,
            description !== undefined ? description : campaign.description,
            client !== undefined ? client : campaign.client,
            status !== undefined ? status : campaign.status,
            channels ? JSON.stringify(channels) : campaign.channels,
            target_audience !== undefined ? target_audience : campaign.target_audience,
            brand_voice !== undefined ? brand_voice : campaign.brand_voice,
            budget !== undefined ? budget : campaign.budget,
            start_date !== undefined ? start_date : campaign.start_date,
            end_date !== undefined ? end_date : campaign.end_date,
            req.params.id
        ]);

        const updatedCampaign = queryOne('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);

        res.json({ campaign: updatedCampaign });
    } catch (error) {
        console.error('Update campaign error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * DELETE /api/campaigns/:id
 * Delete campaign
 */
router.delete('/:id', (req, res) => {
    try {
        const campaign = queryOne('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        execute('DELETE FROM campaigns WHERE id = ?', [req.params.id]);

        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PATCH /api/campaigns/:id/archive
 * Archive campaign
 */
router.patch('/:id/archive', (req, res) => {
    try {
        const campaign = queryOne('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        execute('UPDATE campaigns SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['archived', req.params.id]);

        const updatedCampaign = queryOne('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);

        res.json({ campaign: updatedCampaign });
    } catch (error) {
        console.error('Archive campaign error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
