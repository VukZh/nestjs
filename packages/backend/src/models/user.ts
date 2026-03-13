type UserRoleType = 'user'|'admin'|'author'
type UserStatusType = 'active'|'blocked'

export type UserType = {
  id: string,
  name: string,
  email: string,
  role: UserRoleType,
  status: UserStatusType,
  createdAt: string,
  updatedAt: string,
  deletedAt: string|null
}

export type CreatedUserType = Omit<UserType, 'id'|'createdAt'|'updatedAt'|'deletedAt'>
