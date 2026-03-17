import { TaskType } from './task';

export type TagType = {
  id: number;
  name: string;
  tasks?: TaskType[];
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

export type CreatedTagType = Omit<TagType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'tasks'>

export type UpdatedTagType = Partial<CreatedTagType>;

