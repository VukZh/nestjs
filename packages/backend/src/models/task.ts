import { UserType } from './user';
import { TagType } from './tag';
import { CommentType } from './comment';

type TaskStatusType = 'draft'|'published';

export type TaskType = {
  id: number;
  title: string;
  content: string;
  status: TaskStatusType;
  authorId: number;
  author?: UserType;
  tags?: TagType[];
  comments?: CommentType[];
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

export type CreatedTaskType = Omit<TaskType, 'id'|'createdAt'|'updatedAt'|'deletedAt' | 'comments' | 'author' | 'tags'> & { tagIds?: number[] };

export type UpdatedTaskType = Partial<Omit<TaskType, 'id'|'createdAt'|'updatedAt'|'deletedAt' | 'comments' | 'author' | 'tags'>> & { tagIds?: number[] };
