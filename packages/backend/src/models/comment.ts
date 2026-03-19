import { UserType } from './user';
import { TaskType } from './task';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class CreatedCommentDto {
  @IsEnum(['visible', 'hidden'])
  status: CommentStatusType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  authorId: number;

  @IsInt()
  taskId: number;
}

export class UpdatedCommentDto {
  @IsEnum(['visible', 'hidden'])
  @IsOptional()
  status?: CommentStatusType;

  @IsString()
  @IsOptional()
  content?: string;

  @IsInt()
  @IsOptional()
  authorId?: number;

  @IsInt()
  @IsOptional()
  taskId?: number;
}
