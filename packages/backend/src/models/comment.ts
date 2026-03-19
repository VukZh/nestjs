import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CommentStatusType, CommentType } from './types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export { CommentStatusType, CommentType };

export class GetCommentsDto {
  @ApiPropertyOptional({ description: 'Show all comments (including hidden ones)' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  all?: boolean;
}

export class CreatedCommentDto {
  @ApiProperty({ enum: ['visible', 'hidden'], description: 'The visibility status of the comment' })
  @IsEnum(['visible', 'hidden'])
  status: CommentStatusType;

  @ApiProperty({ description: 'The text content of the comment' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'The author ID' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @ApiProperty({ description: 'The task ID this comment belongs to' })
  @IsInt()
  @Type(() => Number)
  taskId: number;
}

export class UpdatedCommentDto {
  @ApiPropertyOptional({ enum: ['visible', 'hidden'], description: 'The visibility status of the comment' })
  @IsEnum(['visible', 'hidden'])
  @IsOptional()
  status?: CommentStatusType;

  @ApiPropertyOptional({ description: 'The text content of the comment' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'The author ID' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @ApiPropertyOptional({ description: 'The task ID this comment belongs to' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  taskId?: number;
}
