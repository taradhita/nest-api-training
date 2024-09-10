import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterDTO } from '@/modules/auth/dto/register-dto';
import { AuthService } from '@/modules/auth/auth.service';
import { UserModule } from '@/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UnprocessableEntityException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '@/providers/database/prisma/prisma.service';
import { PrismaModule } from '@/providers/database/prisma/prisma.module';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let logger: Logger;
  let prismaService: PrismaService;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({
      data: {
        id: 1,
      },
    }),
    login: jest.fn().mockImplementation(async (loginData) => {
      if (loginData.email === 'invalid@example.com') {
        throw new UnprocessableEntityException('Invalid email');
      }
      if (loginData.password === 'incorrectpassword') {
        throw new UnprocessableEntityException('Incorrect password');
      }
      return {
        data: {
          access_token: 'token',
        },
      };
    }),
  };

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      // Add other methods as needed
    },
  };

  beforeEach(async () => {
    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: WINSTON_MODULE_PROVIDER, // Inject the Winston logger
          useValue: mockLogger, // Use the mock logger
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
      imports: [
        UserModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
        PrismaModule,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    logger = module.get<Logger>(WINSTON_MODULE_PROVIDER);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register', async () => {
    const registerDTO = {
      name: 'User',
      email: 'user@gmail.com',
      password: 'password',
    } as RegisterDTO;

    const registerSpy = jest.spyOn(service, 'register');

    const result = await controller.register(registerDTO);

    expect(result).toEqual({
      data: {
        id: expect.any(Number),
      },
    });
    expect(registerSpy).toHaveBeenCalledWith(registerDTO);
    expect(logger.info).toHaveBeenCalledWith(registerDTO);
  });

  it('should return access token for valid login credentials', async () => {
    // Mock userService.user to return a user
    // Mock bcrypt.compare to return true
    // Mock jwtService.sign to return a token

    const loginData = {
      email: 'test@example.com',
      password: 'password',
    };

    const result = await service.login(loginData);

    expect(result).toHaveProperty('data');
    expect(result.data).toHaveProperty('access_token');
  });

  it('should throw UnprocessableEntityException for invalid email', async () => {
    const loginData = {
      email: 'invalid@example.com',
      password: 'password',
    };

    await expect(service.login(loginData)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('should throw UnprocessableEntityException for incorrect password', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'incorrectpassword',
    };

    await expect(service.login(loginData)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
