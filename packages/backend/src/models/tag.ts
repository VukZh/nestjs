export type TagType = {
  id?: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreatedTagType = Omit<TagType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
