import { Prisma, User } from 'generated/prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(userId: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
