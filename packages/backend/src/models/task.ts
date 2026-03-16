type TaskStatusType = 'draft'|'published';

export type TaskType = {
  id?: number;
  title: string;
  content: string;
  status: TaskStatusType;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string|null;
};

export type CreatedTaskType = Omit<TaskType, 'id'|'createdAt'|'updatedAt'|'deletedAt'>
