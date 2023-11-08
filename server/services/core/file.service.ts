import {
  TcService,
  PureContext,
  TcContext,
  buildUploadUrl,
  config,
  TcDbService,
  NoPermissionError,
  TcMinioService,
} from 'tailchat-server-sdk';
import _ from 'lodash';
import mime from 'mime';
import type { BucketItemStat, Client as MinioClient } from 'minio';
import { isValidStaticAssetsUrl, isValidStr } from '../../lib/utils';
import path from 'node:path';
import type { FileDocument, FileModel } from '../../models/file';
import { Types } from 'mongoose';
import got from 'got';
import { Readable } from 'node:stream';

interface FileService extends TcService, TcDbService<FileDocument, FileModel> {}
class FileService extends TcService {
  get serviceName(): string {
    return 'file';
  }

  get minioClient(): MinioClient {
    return this.client;
  }

  get bucketName(): string {
    return config.storage.bucketName;
  }

  onInit(): void {
    this.registerLocalDb(require('../../models/file').default);
    this.registerMixin(TcMinioService);
    const minioUrl = config.storage.minioUrl;
    const [endPoint, port] = minioUrl.split(':');

    // https://github.com/designtesbrot/moleculer-minio#settings
    this.registerSetting('endPoint', endPoint);
    this.registerSetting('port', Number(port));
    this.registerSetting('useSSL', config.storage.ssl);
    this.registerSetting('accessKey', config.storage.user);
    this.registerSetting('secretKey', config.storage.pass);
    this.registerSetting('pathStyle', config.storage.pathStyle);

    this.registerAction('save', this.save);
    this.registerAction('saveFileWithUrl', this.saveFileWithUrl, {
      visibility: 'public',
      params: {
        fileUrl: 'string',
      },
    });
    this.registerAction('get', this.get, {
      params: {
        objectName: 'string',
      },
      disableSocket: true,
    });
    this.registerAction('stat', this.stat, {
      params: {
        objectName: 'string',
      },
      disableSocket: true,
    });
    this.registerAction('delete', this.delete, {
      params: {
        objectName: 'string',
      },
      disableSocket: true,
      visibility: 'public',
    });
  }

  async onInited() {
    // TODO: 看看有没有办法用一个ctx包起来
    // Services Available
    if (config.feature.disableFileCheck) {
      return;
    }

    const isExists = await this.actions['bucketExists'](
      {
        bucketName: this.bucketName,
      },
      {
        timeout: 20000, // 20s
      }
    );
    if (isExists === false) {
      // bucket不存在，创建新的
      this.logger.info(
        '[File]',
        'Bucket 不存在, 创建新的Bucket',
        this.bucketName
      );
      await this.actions['makeBucket']({
        bucketName: this.bucketName,
      });
    }

    const buckets = await this.actions['listBuckets']();
    this.logger.info(`[File] MinioInfo: | buckets: ${JSON.stringify(buckets)}`);
  }

  /**
   * 通过文件流存储到本地
   */
  async save(
    ctx: TcContext<
      {},
      {
        $params: any;
        filename: any;
      }
    >
  ) {
    const t = ctx.meta.t;
    this.logger.info('Received upload $params:', ctx.meta.$params);

    return new Promise(async (resolve, reject) => {
      const userId = ctx.meta.userId;
      this.logger.info('Received upload meta:', ctx.meta);

      if (!isValidStr(userId)) {
        throw new NoPermissionError(t('用户无上传权限'));
      }

      const originFilename = String(ctx.meta.filename);

      const stream = ctx.params as NodeJS.ReadableStream;
      (stream as any).on('error', (err) => {
        // 这里是文件传输错误处理
        // 比如文件过大
        this.logger.error('File error received', err.message);
        reject(err);
      });

      try {
        const { etag, objectName, url } = await this.saveFileStream(
          ctx,
          originFilename,
          stream
        );

        resolve({
          etag,
          path: `${this.bucketName}/${objectName}`,
          url,
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 通过url存储文件
   * 仅允许内部调用
   *
   * NOTICE: 这里可能会有一个问题，就是可能会出现同一张图片被不同人存储多遍
   * 需要优化
   * @param fileUrl
   */
  async saveFileWithUrl(
    ctx: TcContext<{
      fileUrl: string;
    }>
  ) {
    const fileUrl = ctx.params.fileUrl;
    const t = ctx.meta.t;

    if (!isValidStaticAssetsUrl(fileUrl)) {
      throw new Error(t('文件地址不是一个合法的资源地址'));
    }

    return new Promise(async (resolve, reject) => {
      const req = got.stream(fileUrl);
      const stream = Readable.from(req);
      stream.on('error', (err: Error) => {
        // 这里是文件传输错误处理
        // 比如文件过大
        this.logger.error('File error received', err.message);
        reject(err);
      });

      try {
        const filename = _.last(fileUrl.split('/'));
        const { etag, objectName, url } = await this.saveFileStream(
          ctx,
          filename,
          stream
        );

        resolve({
          etag,
          path: `${this.bucketName}/${objectName}`,
          url,
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 保存文件流
   */
  async saveFileStream(
    ctx: TcContext,
    filename: string,
    fileStream: NodeJS.ReadableStream
  ): Promise<{ etag: string; url: string; objectName: string }> {
    const span = ctx.startSpan('file.saveFileStream');
    const ext = path.extname(filename);

    // 临时仓库
    const tmpObjectName = `tmp/${this.randomName()}${ext}`;

    const { etag } = await this.actions['putObject'](fileStream, {
      meta: {
        bucketName: this.bucketName,
        objectName: tmpObjectName,
        metaData: {
          'content-type': mime.getType(ext),
        },
      },
      parentCtx: ctx,
    });

    const { url, objectName } = await this.persistFile(
      ctx,
      tmpObjectName,
      etag,
      ext
    );

    span.finish();

    return {
      etag,
      url,
      objectName,
    };
  }

  /**
   * 持久化存储文件
   */
  async persistFile(
    ctx: TcContext,
    tmpObjectName: string,
    etag: string,
    ext: string
  ): Promise<{
    url: string;
    objectName: string;
  }> {
    const span = ctx.startSpan('file.persistFile');
    const userId = ctx.meta.userId;

    // 存储在上传者自己的子目录
    const objectName = `files/${userId}/${etag}${ext}`;

    try {
      await this.actions['copyObject'](
        {
          bucketName: this.bucketName,
          objectName,
          sourceObject: `/${this.bucketName}/${tmpObjectName}`, // NOTICE: 此处要填入带bucketName的完成路径
          conditions: {
            matchETag: etag,
          },
        },
        {
          parentCtx: ctx,
        }
      );
    } finally {
      this.minioClient.removeObject(this.bucketName, tmpObjectName);
    }

    const url = buildUploadUrl(objectName);

    // 异步执行, 将其存入数据库
    this.minioClient
      .statObject(this.bucketName, objectName)
      .then((stat) =>
        this.adapter.model.updateOne(
          {
            bucketName: this.bucketName,
            objectName,
          },
          {
            etag,
            userId: new Types.ObjectId(userId),
            url,
            size: stat.size,
            metaData: stat.metaData,
          },
          {
            upsert: true,
          }
        )
      )
      .catch((err) => {
        this.logger.error(`持久化到数据库失败: ${objectName}`, err);
      });

    span.finish();

    return {
      url,
      objectName,
    };
  }

  /**
   * 获取客户端的信息
   */
  async get(
    ctx: PureContext<{
      objectName: string;
    }>
  ) {
    const objectName = ctx.params.objectName;

    const stream = await this.minioClient.getObject(
      this.bucketName,
      objectName
    );

    this.adapter.model
      .updateOne(
        {
          bucketName: this.bucketName,
          objectName,
        },
        {
          $inc: {
            views: 1,
          },
        }
      )
      .catch(() => {});

    return stream;
  }

  /**
   * 获取客户端的信息
   */
  async stat(
    ctx: PureContext<{
      objectName: string;
    }>
  ): Promise<BucketItemStat> {
    const objectName = ctx.params.objectName;

    const stat = await this.minioClient.statObject(this.bucketName, objectName);

    return stat;
  }

  /**
   * 删除文件
   */
  async delete(
    ctx: TcContext<{
      objectName: string;
    }>
  ) {
    const objectName = ctx.params.objectName;

    try {
      // 先删文件再删记录，确保文件被删除
      await this.minioClient.removeObject(this.bucketName, objectName);
      await this.adapter.model.deleteMany({
        bucketName: this.bucketName,
        objectName,
      });
    } catch (err) {
      this.logger.warn('Delete file error:', objectName, err);
    }
  }

  private randomName() {
    return `unnamed_${this.broker.nodeID}_${Date.now()}`;
  }
}

export default FileService;
