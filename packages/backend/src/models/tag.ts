export type TagType = {
  id?: number;
  tag: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreatedTagType = Omit<TagType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
