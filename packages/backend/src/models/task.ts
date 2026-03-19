import { UserType } from './user';
import { TagType } from './tag';
import { CommentType } from './comment';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class CreatedTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(['draft', 'published'])
  status: TaskStatusType;

  @IsInt()
  authorId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[];

  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdatedTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(['draft', 'published'])
  @IsOptional()
  status?: TaskStatusType;

  @IsInt()
  @IsOptional()
  authorId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[];

  @IsString()
  @IsOptional()
  comment?: string;
}
