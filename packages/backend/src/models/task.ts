import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatusType, TaskType } from './types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export { TaskStatusType, TaskType };

export class GetTasksDto {
  @ApiPropertyOptional({ type: [Number], description: 'Filter by tag IDs' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  tagIds?: number[];

  @ApiPropertyOptional({ type: [Number], description: 'Filter by author IDs' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  authorIds?: number[];

  @ApiPropertyOptional({ enum: ['draft', 'published'], description: 'Filter by task status' })
  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: TaskStatusType;

  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 10, description: 'Items per page' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;
}

export class CreatedTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The content/description of the task' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ enum: ['draft', 'published'], description: 'The initial status of the task' })
  @IsEnum(['draft', 'published'])
  status: TaskStatusType;

  @ApiPropertyOptional({ description: 'The author ID (admin only can set this)' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @ApiPropertyOptional({ type: [Number], description: 'IDs of tags to connect' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  tagIds?: number[];

  @ApiPropertyOptional({ description: 'An initial comment to add to the task' })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class UpdatedTaskDto {
  @ApiPropertyOptional({ description: 'The title of the task' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'The content/description of the task' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ enum: ['draft', 'published'], description: 'The status of the task' })
  @IsEnum(['draft', 'published'])
  @IsOptional()
  status?: TaskStatusType;

  @ApiPropertyOptional({ description: 'The author ID' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @ApiPropertyOptional({ type: [Number], description: 'IDs of tags to set' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  tagIds?: number[];

  @ApiPropertyOptional({ description: 'A new comment to add to the task' })
  @IsString()
  @IsOptional()
  comment?: string;
}
