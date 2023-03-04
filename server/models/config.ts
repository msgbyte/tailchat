import {
  getModelForClass,
  prop,
  DocumentType,
  modelOptions,
  Severity,
  ReturnModelType,
} from '@typegoose/typegoose';
import type { Base } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
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
   */
  static async setClientPersistConfig(
    this: ReturnModelType<typeof Config>,
    key: string,
    value: any
  ): Promise<void> {
    await this.updateOne(
      {
        name: Config.globalClientConfigName,
      },
      {
        $set: {
          [key]: value,
        },
      }
    );
  }
}

export type ConfigDocument = DocumentType<Config>;

const model = getModelForClass(Config);

export type ConfigModel = typeof model;

export default model;
