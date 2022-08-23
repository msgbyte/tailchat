import { createTestServiceBroker } from '../../../test/utils';
import LinkmetaService from '../services/linkmeta.service';
import { Types } from 'mongoose';
import _ from 'lodash';

describe('Test "plugin:com.msgbyte.linkinfo" service', () => {
  const { broker, service, insertTestData } =
    createTestServiceBroker<LinkmetaService>(LinkmetaService);

  describe('Test "plugin:com.msgbyte.linkmeta.fetch"', () => {
    test('normal', async () => {
      const url = 'https://www.baidu.com/?fortest';
      const meta: any = await broker.call('plugin:com.msgbyte.linkmeta.fetch', {
        url,
      });

      try {
        expect(meta).toHaveProperty('url', url);
        expect(meta).toHaveProperty('isCache', false);
        expect(meta).toHaveProperty('title');
        expect(meta).toHaveProperty('siteName');
        expect(meta).toHaveProperty('description');
        expect(meta).toHaveProperty('mediaType', 'website');
        expect(meta).toHaveProperty('contentType', 'text/html');
        expect(meta).toHaveProperty('images');
        expect(meta).toHaveProperty('videos');
        expect(meta).toHaveProperty('favicons');
        expect(meta).toMatchSnapshot();

        const metaWithCache: any = await broker.call(
          'plugin:com.msgbyte.linkmeta.fetch',
          {
            url,
          }
        );
        expect(metaWithCache).toHaveProperty('isCache', true);
      } finally {
        await service.adapter.model.deleteOne({
          url,
        });
      }
    });

    test('pure video', async () => {
      const url = 'https://www.w3schools.com/html/mov_bbb.mp4';
      const meta: any = await broker.call('plugin:com.msgbyte.linkmeta.fetch', {
        url,
      });

      expect(meta).toMatchSnapshot();
    });

    test('pure image', async () => {
      const url = 'https://www.w3schools.com/html/pic_trulli.jpg';
      const meta: any = await broker.call('plugin:com.msgbyte.linkmeta.fetch', {
        url,
      });

      expect(meta).toMatchSnapshot();
    });

    test('pure ogg', async () => {
      const url = 'https://www.w3schools.com/html/horse.ogg';
      const meta: any = await broker.call('plugin:com.msgbyte.linkmeta.fetch', {
        url,
      });

      expect(meta).toMatchSnapshot();
    });

    test('pure mp3', async () => {
      const url = 'https://www.w3schools.com/html/horse.mp3';
      const meta: any = await broker.call('plugin:com.msgbyte.linkmeta.fetch', {
        url,
      });

      expect(meta).toMatchSnapshot();
    });
  });
});
