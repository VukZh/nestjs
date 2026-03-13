import { Injectable } from '@nestjs/common';
import { CreatedUserType, UserType } from "../models/user";


@Injectable()
export class UsersService {
  private users: UserType[] = []
  getAll(){
    return this.users
  }
  createUser(user: CreatedUserType){
    this.users.push({...user,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    })
    return user
  }
  getUserById(id: string) {
    return this.users.find(user => user?.id === id)
  }
  deleteUserById(id: string) {
    return this.users.filter(user => user?.id !== id)
  }
  updateUserById(id: string, userUpdated: UserType) {
    this.users = this.users.map(user => user.id === id ? userUpdated : user)
    return userUpdated
  }
}
