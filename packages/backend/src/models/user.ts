import { TaskType } from './task';
import { CommentType } from './comment';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type UserRoleType = 'user' | 'admin' | 'author';
export type UserStatusType = 'active' | 'blocked';

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: UserRoleType;
  status: UserStatusType;
  tasks?: TaskType[];
  comments?: CommentType[];
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
};

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
