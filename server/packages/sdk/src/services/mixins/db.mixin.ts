import { Context, Errors, ServiceSchema } from 'moleculer';
import BaseDBService, { MoleculerDB } from 'moleculer-db';
import { MongooseDbAdapter } from '../lib/moleculer-db-adapter-mongoose';
import type { Document, FilterQuery, Model } from 'mongoose';
import { config } from '../lib/settings';
import type { ReturnModelType } from '@typegoose/typegoose';
import type {
  AnyParamConstructor,
  BeAnObject,
} from '@typegoose/typegoose/lib/types';

type EntityChangedType = 'created' | 'updated';

// type MoleculerDBMethods = MoleculerDB<MongooseDbAdapter>['methods'];
type MoleculerDBMethods = MoleculerDB<any>['methods'];

// fork from moleculer-db-adapter-mongoose/index.d.ts
interface FindFilters<T extends Document> {
  query?: FilterQuery<T>;
  search?: string;
  searchFields?: string[]; // never used???
  sort?: string | string[];
  offset?: number;
  limit?: number;
}

// 复写部分 adapter 的方法类型
interface TcDbAdapterOverwrite<T extends Document, M extends Model<T>> {
  model: M;
  insert(entity: Partial<T>): Promise<T>;
  find(filters: FindFilters<T>): Promise<T>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
}

export interface TcDbService<
  T extends Document = Document,
  M extends Model<T> = Model<T>
> extends MoleculerDBMethods {
  entityChanged(type: EntityChangedType, json: {}, ctx: Context): Promise<void>;

  adapter: Omit<MongooseDbAdapter<T>, keyof TcDbAdapterOverwrite<T, M>> &
    TcDbAdapterOverwrite<T, M>;

  /**
   * 转换fetch出来的文档, 变成一个json
   */
  transformDocuments: MoleculerDB<
    // @ts-ignore
    MongooseDbAdapter<T>
  >['methods']['transformDocuments'];
}

export type TcDbModel = ReturnModelType<AnyParamConstructor<any>, BeAnObject>;

/**
 * Tc 数据库mixin
 * @param model 数据模型
 */
export function TcDbService(model: TcDbModel): Partial<ServiceSchema> {
  const actions = {
    /**
     * 自动操作全关
     */
    find: false,
    count: false,
    list: false,
    create: false,
    insert: false,
    get: false,
    update: false,
    remove: false,
  };

  const methods = {
    /**
     * 实体变更时触发事件
     */
    async entityChanged(type, json, ctx) {
      await this.clearCache();
      const eventName = `${this.name}.entity.${type}`;
      this.broker.emit(eventName, { meta: ctx.meta, entity: json });
    },
  };

  if (!config.mongoUrl) {
    throw new Errors.MoleculerClientError('需要环境变量 MONGO_URL');
  }

  return {
    mixins: [BaseDBService],
    adapter: new MongooseDbAdapter(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    model,
    actions,
    methods,
  };
}
