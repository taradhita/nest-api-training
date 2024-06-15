import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

  async register(userCreateInput: Prisma.UsersCreateInput): Promise<any> {
    const hashedPassword: string = await bcrypt.hash(
      userCreateInput.password,
      10,
    );

    const userData: Prisma.UsersCreateInput = {
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

  async login(loginData: { email: string; password: string }): Promise<any> {
    const user = await this.userService.user({
      email: loginData.email,
    });

    if (!user) {
      throw new UnprocessableEntityException({
        message: 'Email not found',
      });
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new UnprocessableEntityException({
        message: 'Incorrect password',
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      data: {
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
