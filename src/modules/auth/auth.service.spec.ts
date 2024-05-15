import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../../providers/database/prisma/prisma.module';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
      imports: [PrismaModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(authService.register).toBeDefined();
    });

    it('should create user', async () => {
      const userData = {
        name: 'User',
        email: 'user@example.com',
        password: 'password',
      } as Prisma.usersCreateInput;
      const createSpy = jest.spyOn(userService, 'createUser');

      await authService.register(userData);

      expect(createSpy).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password: expect.any(String),
      });

      expect(createSpy).toHaveBeenCalledTimes(1);
    });
  });
});
