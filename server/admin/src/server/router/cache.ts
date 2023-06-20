import { Router } from 'express';
import { broker } from '../broker';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * 清理所有缓存
 */
router.post('/clean', auth(), async (req, res, next) => {
  try {
    if (!broker.cacher) {
      res.json({
        success: false,
        message: 'Not found cacher',
      });
      return;
    }
    await broker.cacher.clean();

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

export { router as cacheRouter };
