export interface MessageMetaStruct {
  mentions?: string[];
  reply?: {
    _id: string;
    author: string;
    content: string;
  };
}
