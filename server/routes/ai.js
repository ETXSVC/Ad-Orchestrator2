import express from 'express';
import { generateAdCopy, generateAdImage, saveGeneration, getGeneration } from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/ai/generate/text
 * Generate ad copy using AI
 */
router.post('/generate/text', async (req, res) => {
    try {
        const { prompt, model = 'gpt-4', temperature = 0.7, max_tokens = 500, brand_voice, target_audience } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await generateAdCopy(prompt, {
            model,
            temperature,
            max_tokens,
            brand_voice,
            target_audience
        });

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        // Save generation to database
        const generation = saveGeneration(
            req.user.id,
            'text',
            prompt,
            model,
            { temperature, max_tokens, brand_voice, target_audience },
            result.result
        );

        res.json({
            generation_id: generation?.id,
            result: result.result,
            metadata: result.metadata
        });
    } catch (error) {
        console.error('Generate text error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/ai/generate/image
 * Generate ad image using DALL-E
 */
router.post('/generate/image', async (req, res) => {
    try {
        const { prompt, size = '1024x1024', quality = 'standard' } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await generateAdImage(prompt, { size, quality });

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        // Save generation to database
        const generation = saveGeneration(
            req.user.id,
            'image',
            prompt,
            'dall-e-3',
            { size, quality },
            null,
            result.result_url
        );

        res.json({
            generation_id: generation?.id,
            result_url: result.result_url,
            metadata: result.metadata
        });
    } catch (error) {
        console.error('Generate image error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/ai/generations/:id
 * Get generation by ID
 */
router.get('/generations/:id', (req, res) => {
    try {
        const generation = getGeneration(req.params.id);

        if (!generation) {
            return res.status(404).json({ error: 'Generation not found' });
        }

        res.json({ generation });
    } catch (error) {
        console.error('Get generation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/ai/save/:id
 * Save AI generation as asset
 */
router.post('/save/:id', async (req, res) => {
    try {
        const generation = getGeneration(req.params.id);

        if (!generation) {
            return res.status(404).json({ error: 'Generation not found' });
        }

        const { campaign_id, title, description } = req.body;

        // Import execute function
        const { execute } = await import('../db/database.js');

        if (generation.type === 'image') {
            // Save image generation as asset
            const metadata = {
                title: title || 'AI Generated Image',
                description: description || generation.prompt,
                tags: ['ai-generated'],
                keywords: [],
                generation_id: generation.id
            };

            const assetResult = execute(`
        INSERT INTO assets (filename, original_name, url, type, mime_type, size, metadata, campaign_id, status, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                `ai-gen-${generation.id}.png`,
                `AI Generated - ${new Date().toISOString()}.png`,
                generation.result_url,
                'image',
                'image/png',
                0,
                JSON.stringify(metadata),
                campaign_id || null,
                'uploaded',
                req.user.id
            ]);

            res.json({ message: 'Saved as asset', asset_id: assetResult.lastInsertRowid });
        } else {
            // Return text content
            res.json({ message: 'Text generation retrieved', content: generation.result });
        }
    } catch (error) {
        console.error('Save generation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
