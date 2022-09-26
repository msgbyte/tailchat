import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_{{pickPluginName id}}',
  },
})
export class {{pickPluginNameUp id}} extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;
}

export type {{pickPluginNameUp id}}Document = db.DocumentType<{{pickPluginNameUp id}}>;

const model = getModelForClass({{pickPluginNameUp id}});

export type {{pickPluginNameUp id}}Model = typeof model;

export default model;
