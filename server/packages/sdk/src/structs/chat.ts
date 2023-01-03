export interface MessageReactionStruct {
  name: string;
  author?: string;
}

export interface MessageStruct {
  _id: string;
  content: string;
  author: string;
  groupId?: string;
  converseId: string;
  hasRecall: boolean;
  reactions: MessageReactionStruct[];
}

export interface MessageMetaStruct {
  mentions?: string[];
  reply?: {
    _id: string;
    author: string;
    content: string;
  };
}
