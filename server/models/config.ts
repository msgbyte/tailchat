import {
  getModelForClass,
  prop,
  DocumentType,
  modelOptions,
  Severity,
  ReturnModelType,
  index,
} from '@typegoose/typegoose';
import type { Base } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@index({ name: 1 })
export class Config implements Base {
  _id: Types.ObjectId;
  id: string;

  static globalClientConfigName = '__client_config__';

  @prop()
  name: string;

  /**
   * config data
   */
  @prop()
  data: object;

  static async getAllClientPersistConfig(
    this: ReturnModelType<typeof Config>
  ): Promise<object> {
    const config = await this.findOne({
      name: Config.globalClientConfigName,
    });

    return config?.data ?? {};
  }

  /**
   * set global client persist config from mongodb
   *
   * return all config from db
   */
  static async setClientPersistConfig(
    this: ReturnModelType<typeof Config>,
    key: string,
    value: any
  ): Promise<Record<string, any>> {
    const newConfig = await this.findOneAndUpdate(
      {
        name: Config.globalClientConfigName,
      },
      {
        $set: {
          [`data.${key}`]: value,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return newConfig.data;
  }
}

export type ConfigDocument = DocumentType<Config>;

const model = getModelForClass(Config);

export type ConfigModel = typeof model;

export default model;
