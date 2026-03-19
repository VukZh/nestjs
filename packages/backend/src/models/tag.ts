import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TagType } from './types';

export { TagType };

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
