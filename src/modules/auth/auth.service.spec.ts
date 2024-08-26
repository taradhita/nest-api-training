import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Prisma } from '@prisma/client';
import { PrismaModule } from '../../providers/database/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
      imports: [PrismaModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        email: 'test@example.com',
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

  describe('login', () => {
    it('should be defined', () => {
      expect(authService.login).toBeDefined();
    });

    it('should login user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password',
      };

      const fetchUserSpy = jest.spyOn(userService, 'user');
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      jest.spyOn(jwtService, 'sign').mockReturnValue('accessToken');

      const result = await authService.login(loginData);

      expect(fetchUserSpy).toHaveBeenCalledWith({
        email: loginData.email,
      });
      expect(result).toEqual({
        data: {
          access_token: expect.any(String),
        },
      });
    });
  });
});
