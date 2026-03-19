import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRoleType, UserStatusType, UserType } from './types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export { UserRoleType, UserStatusType, UserType };

export class CreatedUserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['user', 'admin', 'author'], description: 'The role of the user' })
  @IsEnum(['user', 'admin', 'author'])
  role: UserRoleType;

  @ApiProperty({ enum: ['active', 'blocked'], description: 'The status of the user' })
  @IsEnum(['active', 'blocked'])
  status: UserStatusType;
}

export class UpdatedUserDto {
  @ApiPropertyOptional({ description: 'The name of the user' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'The email of the user' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ enum: ['user', 'admin', 'author'], description: 'The role of the user' })
  @IsEnum(['user', 'admin', 'author'])
  @IsOptional()
  role?: UserRoleType;

  @ApiPropertyOptional({ enum: ['active', 'blocked'], description: 'The status of the user' })
  @IsEnum(['active', 'blocked'])
  @IsOptional()
  status?: UserStatusType;
}
