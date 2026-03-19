import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatusType, TaskType } from './types';

export { TaskStatusType, TaskType };

export class GetTasksDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  tagIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  authorIds?: number[];

  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: TaskStatusType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}

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
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
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
  @Type(() => Number)
  authorId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  tagIds?: number[];

  @IsString()
  @IsOptional()
  comment?: string;
}
