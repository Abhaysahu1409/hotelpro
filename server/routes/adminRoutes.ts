import { Router, Response } from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  resetDemoData,
  getDbStatus,
} from '../db';
import { verifyToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Protect all admin routes
router.use(verifyToken, requireAdmin);

// GET /api/admin/stats - Overview metrics
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const stats = await getAdminStats();
    const dbStatus = await getDbStatus();

    res.json({
      success: true,
      stats,
      dbStatus,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to compute admin statistics: ' + error.message,
    });
  }
});

// GET /api/admin/users - List users
router.get('/users', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users: ' + error.message,
    });
  }
});

// PATCH /api/admin/users/:id/role - Update user role
router.patch('/users/:id/role', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "user" or "admin".',
      });
      return;
    }

    // Prevent admin from demoting themselves
    if (req.user?.id === id && role !== 'admin') {
      res.status(400).json({
        success: false,
        message: 'You cannot demote your own administrator account.',
      });
      return;
    }

    const updated = await updateUserRole(id, role);
    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    res.json({
      success: true,
      message: `User role successfully updated to ${role}.`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role: ' + error.message,
    });
  }
});

// POST /api/admin/seed-reset - Reset data to default seeds
router.post('/seed-reset', async (_req: AuthRequest, res: Response) => {
  try {
    const result = await resetDemoData();
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to reseed database: ' + error.message,
    });
  }
});

export default router;
