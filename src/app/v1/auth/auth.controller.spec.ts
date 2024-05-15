import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterDTO } from '../../../modules/auth/dto/register-dto';
import { AuthService } from '../../../modules/auth/auth.service';
import { UserModule } from '../../../modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UnprocessableEntityException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
      imports: [
        UserModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register', async () => {
    const registerDTO = {
      name: 'User',
      email: 'user@mail.com',
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
    // Mock userService.user to return null

    const loginData = {
      email: 'invalid@example.com',
      password: 'password',
    };

    await expect(service.login(loginData)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('should throw UnprocessableEntityException for incorrect password', async () => {
    // Mock userService.user to return a user
    // Mock bcrypt.compare to return false

    const loginData = {
      email: 'test@example.com',
      password: 'incorrectpassword',
    };

    await expect(service.login(loginData)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });
});
