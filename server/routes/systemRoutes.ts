import { Router, Request, Response } from 'express';
import { getDbStatus } from '../db';

const router = Router();

// GET /api/system/status - Public endpoint showing DB connection health & mode
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await getDbStatus();
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
      version: '1.0.0-hotelpro',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system status: ' + error.message,
    });
  }
});

export default router;
