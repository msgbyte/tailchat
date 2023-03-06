/**
 * Network 相关接口
 */

import { Router } from 'express';
import { broker } from '../broker';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/client', auth(), async (req, res) => {
  const config = await broker.call('config.client');

  res.json({
    config,
  });
});

export { router as configRouter };
