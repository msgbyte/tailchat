import { Router } from 'express';
import { auth } from '../middleware/auth';
import messageModel from '../../../../models/chat/message';
import groupModel from '../../../../models/group/group';
import fileModel from '../../../../models/file';
import dayjs from 'dayjs';
import { db } from 'tailchat-server-sdk';

const router = Router();

router.get('/activeGroups', auth(), async (req, res) => {
  // 返回最近7天的最活跃的群组
  const day = 7;
  const aggregateRes: { _id: string; count: number }[] = await messageModel
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
          _id: '$groupId' as any,
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: '_id',
          as: 'groupInfo',
        },
      },
      {
        $project: {
          _id: 0,
          groupId: '$_id',
          messageCount: '$count',
          groupName: {
            $arrayElemAt: ['$groupInfo.name', 0],
          },
        },
      },
    ])
    .exec();

  const activeGroups = aggregateRes;

  res.json({ activeGroups });
});

router.get('/activeUsers', auth(), async (req, res) => {
  // 返回最近7天的最活跃的用户
  const day = 7;
  const aggregateRes: { _id: string; count: number }[] = await messageModel
    .aggregate([
      {
        $match: {
          author: {
            $ne: new db.Types.ObjectId('000000000000000000000000'),
          },
          createdAt: {
            $gte: dayjs().subtract(day, 'd').startOf('d').toDate(),
            $lt: dayjs().endOf('d').toDate(),
          },
        },
      },
      {
        $group: {
          _id: '$author' as any,
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          messageCount: '$count',
          userName: {
            $concat: [
              {
                $arrayElemAt: ['$userInfo.nickname', 0],
              },
              '#',
              {
                $arrayElemAt: ['$userInfo.discriminator', 0],
              },
            ],
            // $arrayElemAt: ['$userInfo.nickname', 0],
          },
        },
      },
    ])
    .exec();

  const activeUsers = aggregateRes;

  res.json({ activeUsers });
});

router.get('/largeGroups', auth(), async (req, res) => {
  // 返回最大的 5 个群组
  const limit = 5;
  const aggregateRes: { _id: string; count: number }[] = await groupModel
    .aggregate([
      {
        $project: {
          name: 1,
          memberCount: {
            $size: '$members',
          },
        },
      },
      {
        $sort: {
          memberCount: -1,
        },
      },
      {
        $limit: limit,
      },
    ])
    .exec();

  const largeGroups = aggregateRes;

  res.json({ largeGroups });
});

router.get('/fileStorageUserTop', auth(), async (req, res) => {
  // 返回最大的 5 个群组
  const limit = 5;
  const aggregateRes: { _id: string; count: number }[] = await fileModel
    .aggregate([
      {
        $group: {
          _id: '$userId',
          total: {
            $sum: '$size',
          },
        } as any,
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          fileStorageTotal: '$total',
          userName: {
            $concat: [
              {
                $arrayElemAt: ['$userInfo.nickname', 0],
              },
              '#',
              {
                $arrayElemAt: ['$userInfo.discriminator', 0],
              },
            ],
            // $arrayElemAt: ['$userInfo.nickname', 0],
          },
        },
      },
    ])
    .exec();

  const fileStorageUserTop = aggregateRes;

  res.json({ fileStorageUserTop });
});

export { router as analyticsRouter };
