import { TaskType } from './task';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type TagType = {
  id: number;
  name: string;
  tasks?: TaskType[];
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

export class CreatedTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatedTagDto {
  @IsString()
  @IsOptional()
  name?: string;
}
