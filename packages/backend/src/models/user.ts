import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRoleType, UserStatusType, UserType } from './types';

export { UserRoleType, UserStatusType, UserType };

export class CreatedUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['user', 'admin', 'author'])
  role: UserRoleType;

  @IsEnum(['active', 'blocked'])
  status: UserStatusType;
}

export class UpdatedUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(['user', 'admin', 'author'])
  @IsOptional()
  role?: UserRoleType;

  @IsEnum(['active', 'blocked'])
  @IsOptional()
  status?: UserStatusType;
}
