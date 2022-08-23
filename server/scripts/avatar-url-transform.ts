import { mongoose } from '@typegoose/typegoose';
import { config } from 'tailchat-server-sdk';
import User from '../models/user/user';
import inquirer from 'inquirer';
import RedisClient from 'ioredis';
import Group from '../models/group/group';

/**
 * 运维脚本: 修改服务端路径在数据库中的存储
 * 连接mongodb与redis
 * 修改头像路径
 */

const redis = new RedisClient(config.redisUrl);
const conn = mongoose.connect(config.mongoUrl);

(async () => {
  const { from, to } = await inquirer.prompt([
    {
      type: 'input',
      name: 'from',
      message: `原始路径`,
      default: 'http://127.0.0.1:14320/',
    },
    {
      type: 'input',
      name: 'to',
      message: `修改后路径?`,
      default: 'http://127.0.0.1:11000/',
    },
  ]);

  console.log('正在连接数据库...');
  await Promise.resolve(conn);

  try {
    console.log('正在查询符合条件的记录...');

    const userList = await User.find({
      avatar: {
        $regex: `^${from}`,
      },
    });

    const groupList = await Group.find({
      avatar: {
        $regex: `^${from}`,
      },
    });

    if (userList.length === 0 && groupList.length === 0) {
      console.log('没有找到符合条件的记录。');
      return;
    }

    console.log('找到符合条件的记录如下:');
    console.log('-----------用户-----------');
    for (const item of userList) {
      console.log(
        `- ${item.email || item.username}(${item.avatar})\n  -> ${String(
          item.avatar
        ).replace(from, to)}`
      );
    }

    console.log('-----------群组-----------');
    for (const item of groupList) {
      console.log(
        `- ${item.name}(${item.avatar})\n  -> ${String(item.avatar).replace(
          from,
          to
        )}`
      );
    }

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `确定要修改${userList.length + groupList.length}条记录么?`,
        default: false,
      },
    ]);

    if (confirm === false) {
      console.log('已取消');
      return;
    }

    await Promise.all([
      ...userList.map((item) => {
        item.avatar = String(item.avatar).replace(from, to);
        return item.save();
      }),
      ...groupList.map((item) => {
        item.avatar = String(item.avatar).replace(from, to);
        return item.save();
      }),
    ]);
    console.log('数据库修改完成, 正在清理缓存');

    const keys = await redis.keys('MOL-user.resolveToken:*');
    await redis.del(keys);

    console.log(`缓存清理完成, 清理缓存: ${keys.length} 条`);
  } catch (e) {
    console.error(e);
  }
})().finally(() => {
  mongoose.connection.close();
  redis.disconnect();
});
