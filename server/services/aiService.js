import OpenAI from 'openai';
import { queryOne, execute } from '../db/database.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

/**
 * Generate ad copy using AI
 */
export async function generateAdCopy(prompt, options = {}) {
    try {
        const {
            model = 'gpt-4',
            temperature = 0.7,
            max_tokens = 500,
            brand_voice = null,
            target_audience = null
        } = options;

        // Build enhanced prompt
        let enhancedPrompt = prompt;

        if (brand_voice) {
            enhancedPrompt = `Brand voice: ${brand_voice}\n\n${enhancedPrompt}`;
        }

        if (target_audience) {
            enhancedPrompt = `Target audience: ${target_audience}\n\n${enhancedPrompt}`;
        }

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: model === 'gpt-4' ? 'gpt-4' : 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert advertising copywriter. Create compelling, engaging ad copy that drives conversions.'
                },
                {
                    role: 'user',
                    content: enhancedPrompt
                }
            ],
            temperature,
            max_tokens
        });

        const result = completion.choices[0].message.content;

        return {
            success: true,
            result,
            metadata: {
                model,
                tokens_used: completion.usage.total_tokens
            }
        };
    } catch (error) {
        console.error('AI text generation error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate ad image using DALL-E
 */
export async function generateAdImage(prompt, options = {}) {
    try {
        const {
            size = '1024x1024',
            quality = 'standard'
        } = options;

        // Call DALL-E API
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size,
            quality
        });

        const imageUrl = response.data[0].url;

        return {
            success: true,
            result_url: imageUrl,
            metadata: {
                model: 'dall-e-3',
                size,
                quality
            }
        };
    } catch (error) {
        console.error('AI image generation error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Save AI generation to database
 */
export function saveGeneration(userId, type, prompt, model, parameters, result, resultUrl = null, status = 'completed') {
    try {
        const genResult = execute(`
      INSERT INTO ai_generations (type, prompt, model, parameters, result, result_url, status, user_id, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
            type,
            prompt,
            model,
            JSON.stringify(parameters),
            result || null,
            resultUrl || null,
            status,
            userId
        ]);

        return queryOne('SELECT * FROM ai_generations WHERE id = ?', [genResult.lastInsertRowid]);
    } catch (error) {
        console.error('Save generation error:', error);
        return null;
    }
}

/**
 * Get generation by ID
 */
export function getGeneration(id) {
    try {
        const generation = queryOne('SELECT * FROM ai_generations WHERE id = ?', [id]);

        if (generation && generation.parameters) {
            try {
                generation.parameters = JSON.parse(generation.parameters);
            } catch (e) {
                generation.parameters = {};
            }
        }

        return generation;
    } catch (error) {
        console.error('Get generation error:', error);
        return null;
    }
}
