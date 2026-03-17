import { TaskType } from './task';
import { CommentType } from './comment';

type UserRoleType = 'user'|'admin'|'author'
type UserStatusType = 'active'|'blocked'

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: UserRoleType;
  status: UserStatusType;
  tasks?: TaskType[];
  comments?: CommentType[];
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

export type CreatedUserType = Omit<UserType, 'id'|'createdAt'|'updatedAt'|'deletedAt' | 'tasks' | 'comments'>

export type UpdatedUserType = Partial<CreatedUserType>;
