import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../providers/database/prisma/prisma.service';
import { Prisma, Users } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(data: Prisma.UsersWhereInput): Promise<Users | null> {
    return this.prisma.users.findFirst({
      where: { ...data },
    });
  }

  async createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({ data });
  }
}
