export interface TaskItemType {
  _id: string;
  creator: string;
  assignee?: string[];
  title: string;
  description?: string;
  done: boolean;
  expiredAt?: string;
}
