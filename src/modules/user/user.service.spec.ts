import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../providers/database/prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('user', () => {
    it('should be defined', () => {
      expect(userService.user).toBeDefined();
    });

    it('should return user if found', async () => {
      const id = 1;
      const user = {
        id: 1,
        name: 'User',
        email: 'user@example.com',
        password: 'password',
      };
      jest
        .spyOn(prismaService.users, 'findUnique')
        .mockResolvedValue(user as any);

      const result = await userService.user({ id: id });

      expect(result).toEqual(user);
    });

    it('should return null if not found', async () => {
      const id = 2;
      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue(null);

      const result = await userService.user({ id: id });

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should be defined', () => {
      expect(userService.createUser).toBeDefined();
    });

    it('should create user', async () => {
      const userData = {
        name: 'User',
        email: 'user@example.com',
        password: 'password',
      } as Prisma.usersCreateInput;
      const createSpy = jest.spyOn(prismaService.users, 'create');

      await userService.createUser(userData);

      expect(createSpy).toHaveBeenCalledWith({ data: userData });
    });
  });
});
