export interface GroupTopicComment {
  author: string;
  content: string;
  id: string;
}

export interface GroupTopic {
  _id: string;
  author: string;
  comments: GroupTopicComment[];
  content: string;
  createdAt: string;
  groupId: string;
  panelId: string;
  updatedAt: string;
}
