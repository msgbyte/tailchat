import { Router } from 'express';
import raExpressMongoose from 'express-mongoose-ra-json-server';
import jwt from 'jsonwebtoken';
import { adminAuth, auth, authSecret } from './middleware';

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
      authSecret
    );

    res.json({
      username,
      token: token,
    });
  } else {
    res.status(401).end('username or password incorrect');
  }
});

router.use(
  '/users',
  auth(),
  raExpressMongoose(require('../../../models/user/user').default, {
    q: ['nickname', 'email'],
  })
);
router.use(
  '/messages',
  auth(),
  raExpressMongoose(require('../../../models/chat/message').default, {
    q: ['content'],
    allowedRegexFields: ['content'],
  })
);
router.use(
  '/groups',
  auth(),
  raExpressMongoose(require('../../../models/group/group').default, {
    q: ['name'],
  })
);
router.use(
  '/file',
  auth(),
  raExpressMongoose(require('../../../models/file').default, {
    q: ['objectName'],
  })
);

export { router };
