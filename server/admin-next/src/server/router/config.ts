/**
 * Network 相关接口
 */

import { Router } from 'express';
import { broker } from '../broker';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/client', auth(), async (req, res, next) => {
  try {
    const config = await broker.call('config.client');

    res.json({
      config,
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/client', auth(), async (req, res, next) => {
  try {
    await broker.call('config.setClientConfig', {
      key: req.body.key,
      value: req.body.value,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

export { router as configRouter };
