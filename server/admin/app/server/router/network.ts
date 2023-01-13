/**
 * Network 相关接口
 */

import { Router } from 'express';
import { broker } from '../broker';
import { auth } from '../middleware';
import _ from 'lodash';

const router = Router();

router.get('/all', auth(), async (req, res) => {
  res.json({
    nodes: Array.from(new Map(broker.registry.nodes.nodes).values()).map(
      (item) =>
        _.pick(item, [
          'id',
          'available',
          'local',
          'ipList',
          'hostname',
          'cpu',
          'client',
        ])
    ),
    events: broker.registry.events.events.map((item) => item.name),
    services: broker.registry.services.services.map((item) => item.name),
    actions: Array.from(new Map(broker.registry.actions.actions).keys()),
  });
});

router.get('/ping', auth(), async (req, res) => {
  const pong = await broker.ping();
  res.json(pong);
});

export { router as networkRouter };
