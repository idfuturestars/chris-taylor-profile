/**
 * Developer API Routes
 * Handles API key management and developer portal functionality
 */

import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { apiKeys, apiUsage } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const router = Router();

// Interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    userId?: string;
    claims?: {
      sub: string;
    };
  };
}

// Middleware to ensure user is authenticated
const requireAuth = (req: AuthenticatedRequest, res: Response, next: any) => {
  const userId = req.user?.id || req.user?.userId || req.user?.claims?.sub;
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!req.user!.id) {
    req.user!.id = userId;
  }
  
  next();
};

/**
 * GET /api/developer/keys
 * Get all API keys for authenticated user
 */
router.get('/keys', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id!;
    
    const userKeys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        key: apiKeys.key,
        isActive: apiKeys.isActive,
        createdAt: apiKeys.createdAt,
        lastUsed: apiKeys.lastUsed,
        usageCount: apiKeys.usageCount
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(apiKeys.createdAt);

    res.json({
      success: true,
      keys: userKeys
    });
  } catch (error: any) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

/**
 * POST /api/developer/keys
 * Generate a new API key
 */
const createKeySchema = z.object({
  name: z.string().min(1).max(100)
});

router.post('/keys', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id!;
    const validation = createKeySchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid request',
        details: validation.error 
      });
    }
    
    const { name } = validation.data;
    
    // Check if user has reached key limit (max 5 keys)
    const existingKeys = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)));
    
    if (existingKeys.length >= 5) {
      return res.status(400).json({ 
        error: 'Maximum API key limit reached (5 keys)' 
      });
    }
    
    // Generate secure API key
    const keyValue = `eiq_${randomBytes(32).toString('hex')}`;
    
    // Insert new API key
    const [newKey] = await db
      .insert(apiKeys)
      .values({
        userId,
        name,
        key: keyValue,
        isActive: true,
        usageCount: 0
      })
      .returning();

    res.status(201).json({
      success: true,
      key: newKey
    });
  } catch (error: any) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

/**
 * DELETE /api/developer/keys/:keyId
 * Revoke an API key
 */
router.delete('/keys/:keyId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id!;
    const { keyId } = req.params;
    
    // Update key to inactive
    const [updatedKey] = await db
      .update(apiKeys)
      .set({ 
        isActive: false,
        revokedAt: new Date()
      })
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      ))
      .returning();

    if (!updatedKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error: any) {
    console.error('Error revoking API key:', error);
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

/**
 * GET /api/developer/usage
 * Get usage statistics for user's API keys
 */
router.get('/usage', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id!;
    
    // Get user's API keys
    const userKeys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId));
    
    if (userKeys.length === 0) {
      return res.json({
        callsToday: 0,
        callsThisMonth: 0,
        totalCalls: 0,
        activeKeys: 0
      });
    }
    
    // Get usage statistics
    const keyIds = userKeys.map(k => k.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Count calls today
    const todayUsage = await db
      .select()
      .from(apiUsage)
      .where(and(
        eq(apiUsage.userId, userId),
        eq(apiUsage.requestDate, today)
      ));
    
    const callsToday = todayUsage.reduce((sum, usage) => sum + (usage.requestCount || 0), 0);
    
    // Total usage count from keys
    const totalCalls = userKeys.reduce((sum, key) => sum + (key.usageCount || 0), 0);
    const activeKeys = userKeys.filter(k => k.isActive).length;

    res.json({
      callsToday,
      callsThisMonth: totalCalls, // Simplified for now
      totalCalls,
      activeKeys,
      rateLimit: 1000, // Per hour
      rateLimitWindow: '1 hour'
    });
  } catch (error: any) {
    console.error('Error fetching usage stats:', error);
    res.status(500).json({ error: 'Failed to fetch usage statistics' });
  }
});

export default router;