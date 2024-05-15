import { Injectable } from '@nestjs/common';
import type { User } from './user.interface';
import { PrismaService } from '../../providers/database/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.usersWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.users.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.usersCreateInput): Promise<User> {
    return this.prisma.users.create({ data });
  }
}
