import { UserType } from './user';
import { TaskType } from './task';

type CommentStatusType = 'visible' | 'hidden';

export type CommentType = {
  id: number;
  status: CommentStatusType;
  content: string;
  authorId: number;
  author?: UserType;
  taskId: number;
  task?: TaskType;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

export type CreatedCommentType = Omit<
  CommentType,
  | 'id'
  | 'deletedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'author'
  | 'task'
>;

export type UpdatedCommentType = Partial<Omit<CommentType, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt' | 'author' | 'task'>>;
