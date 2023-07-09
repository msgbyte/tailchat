import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { broker, callBrokerAction } from '../broker';
import { adminAuth, auth, authSecret } from '../middleware/auth';
import { configRouter } from './config';
import { networkRouter } from './network';
import { fileRouter } from './file';
import dayjs from 'dayjs';
import userModel from '../../../../models/user/user';
import messageModel from '../../../../models/chat/message';
import { raExpressMongoose } from '../middleware/express-mongoose-ra-json-server';
import { cacheRouter } from './cache';

const router = Router();

router.post('/login', (req, res) => {
  if (!adminAuth.username || !adminAuth.password) {
    res.status(401).end('Server not set env: ADMIN_USER, ADMIN_PASS');
    return;
  }

  const { username, password } = req.body;

  if (username === adminAuth.username && password === adminAuth.password) {
    // 用户名和密码都正确，返回token
    const token = jwt.sign(
      {
        username,
        platform: 'admin',
      },
      authSecret,
      {
        expiresIn: '2h',
      }
    );

    res.json({
      username,
      token: token,
      expiredAt: new Date().valueOf() + 2 * 60 * 60 * 1000,
    });
  } else {
    res.status(401).end('username or password incorrect');
  }
});

router.use('/network', networkRouter);
router.use('/config', configRouter);
router.use('/file', fileRouter);
router.use('/cache', cacheRouter);

router.get('/user/count/summary', auth(), async (req, res) => {
  // 返回最近14天的用户数统计
  const day = 14;
  const aggregateRes: { count: number; date: string }[] = await userModel
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: dayjs().subtract(day, 'd').startOf('d').toDate(),
            $lt: dayjs().endOf('d').toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            createdAt: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
          } as any,
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          date: '$_id.createdAt',
          count: '$count',
        },
      },
    ])
    .exec();

  const summary = Array.from({ length: day })
    .map((_, d) => {
      const date = dayjs().subtract(d, 'd').format('YYYY-MM-DD');

      return {
        date,
        count: aggregateRes.find((r) => r.date === date)?.count ?? 0,
      };
    })
    .reverse();

  res.json({ summary });
});
router.post('/user/ban', auth(), async (req, res) => {
  const { userId } = req.body;

  const ret = await broker.call('user.banUser', {
    userId,
  });

  res.json({
    ret,
  });
});
router.post('/user/unban', auth(), async (req, res) => {
  const { userId } = req.body;

  const ret = await broker.call('user.unbanUser', {
    userId,
  });

  res.json({
    ret,
  });
});
router.post('/users/system/notify', auth(), async (req, res) => {
  const { scope, specifiedUser, title, content } = req.body;

  let userIds = [];

  if (scope === 'all') {
    const users = await userModel.find(
      {
        // false 或 null(正式用户或者老的用户)
        temporary: {
          $ne: true,
        },
      },
      {
        _id: 1,
      }
    );

    userIds = users.map((u) => u._id);
  } else if (scope === 'specified') {
    userIds = Array.isArray(specifiedUser) ? specifiedUser : [specifiedUser];
  }

  broker.call('chat.inbox.batchAppend', {
    userIds,
    type: 'markdown',
    payload: {
      title,
      content,
    },
  });

  res.json({ userIds });
});
router.use(
  '/users',
  auth(),
  raExpressMongoose(userModel, {
    q: ['nickname', 'email'],
  })
);
router.delete('/messages/:id', auth(), async (req, res) => {
  try {
    const messageId = req.params.id;
    await callBrokerAction('chat.message.deleteMessage', {
      messageId,
    });

    res.json({ id: messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: (err as any).message });
  }
});

router.get('/message/count/summary', auth(), async (req, res) => {
  // 返回最近14天的消息数统计
  const day = 14;
  const aggregateRes: { count: number; date: string }[] = await messageModel
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: dayjs().subtract(day, 'd').startOf('d').toDate(),
            $lt: dayjs().endOf('d').toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            createdAt: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
          } as any,
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          date: '$_id.createdAt',
          count: '$count',
        },
      },
    ])
    .exec();

  const summary = Array.from({ length: day })
    .map((_, d) => {
      const date = dayjs().subtract(d, 'd').format('YYYY-MM-DD');

      return {
        date,
        count: aggregateRes.find((r) => r.date === date)?.count ?? 0,
      };
    })
    .reverse();

  res.json({ summary });
});
router.use(
  '/messages',
  auth(),
  raExpressMongoose(messageModel, {
    q: ['content'],
    allowedRegexFields: ['content'],
  })
);
router.use(
  '/groups',
  auth(),
  raExpressMongoose(require('../../../../models/group/group').default, {
    q: ['name'],
  })
);
router.use(
  '/file',
  auth(),
  raExpressMongoose(require('../../../../models/file').default, {
    q: ['objectName'],
  })
);
router.use(
  '/mail',
  auth(),
  raExpressMongoose(require('../../../../models/user/mail').default)
);
router.use(
  '/p_discover',
  auth(),
  raExpressMongoose(
    require('../../../../plugins/com.msgbyte.discover/models/discover').default
  )
);

export { router as apiRouter };
