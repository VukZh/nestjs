export type UserRoleType = 'user' | 'admin' | 'author';
export type UserStatusType = 'active' | 'blocked';

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

export type TaskStatusType = 'draft' | 'published';

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

export type TagType = {
  id: number;
  name: string;
  tasks?: TaskType[];
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

export type CommentStatusType = 'visible' | 'hidden';

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

export type SignInType = {
  email: string;
  password: string;
}

export type SignUpType = SignInType & {
  password2: string;
};
