import { Router } from 'express';
import raExpressMongoose from 'express-mongoose-ra-json-server';

const router = Router();

router.use(
  '/users',
  raExpressMongoose(require('../../../models/user/user').default, {
    q: ['nickname', 'email'],
  })
);
router.use(
  '/messages',
  raExpressMongoose(require('../../../models/chat/message').default, {
    q: ['content'],
    allowedRegexFields: ['content'],
  })
);
router.use(
  '/groups',
  raExpressMongoose(require('../../../models/group/group').default, {
    q: ['name'],
  })
);
router.use(
  '/file',
  raExpressMongoose(require('../../../models/file').default, {
    q: ['objectName'],
  })
);

export { router };
