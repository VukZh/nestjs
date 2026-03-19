import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CommentStatusType, CommentType } from './types';

export { CommentStatusType, CommentType };

export class GetCommentsDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  all?: boolean;
}

export class CreatedCommentDto {
  @IsEnum(['visible', 'hidden'])
  status: CommentStatusType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @IsInt()
  @Type(() => Number)
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
  @Type(() => Number)
  authorId?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  taskId?: number;
}
