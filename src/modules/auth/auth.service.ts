import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { User } from '../user/user.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(userCreateInput: Prisma.usersCreateInput): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(
      userCreateInput.password,
      10,
    );

    const userData: Prisma.usersCreateInput = {
      ...userCreateInput,
      password: hashedPassword,
    };

    return this.userService.createUser(userData);
  }
}
