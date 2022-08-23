import type { Db, MongoClient } from 'mongodb';

module.exports = {
  async up(db: Db, client: MongoClient) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    const collectionNames = (await db.collections()).map(
      (c) => c.collectionName
    );
    if (!collectionNames.includes('p_simplenotifies')) {
      console.log('not init `p_simplenotifies`, ignored.');
      return;
    }

    const collection = db.collection('p_simplenotifies');
    const list = await collection
      .find({
        type: null,
      })
      .toArray();
    console.log(`待处理记录: ${list.length} 条`);

    for (const item of list) {
      await collection.updateOne(
        {
          _id: item._id,
        },
        {
          $set: {
            type: 'group',
          },
        }
      );
      console.log('已更新:', item._id);
    }
  },

  async down(db: Db, client: MongoClient) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
