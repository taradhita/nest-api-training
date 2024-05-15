import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(userCreateInput: Prisma.usersCreateInput): Promise<any> {
    const hashedPassword: string = await bcrypt.hash(
      userCreateInput.password,
      10,
    );

    const userData: Prisma.usersCreateInput = {
      ...userCreateInput,
      password: hashedPassword,
    };

    const user = await this.userService.createUser(userData);

    return {
      data: {
        id: user.id,
      },
    };
  }
}
