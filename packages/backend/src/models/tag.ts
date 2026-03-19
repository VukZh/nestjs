import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TagType } from './types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export { TagType };

export class CreatedTagDto {
  @ApiProperty({ description: 'The name of the tag' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatedTagDto {
  @ApiPropertyOptional({ description: 'The name of the tag' })
  @IsString()
  @IsOptional()
  name?: string;
}
