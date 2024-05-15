import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { RegisterDTO } from '../../../modules/auth/dto/register-dto';
import { AuthService } from '../../../modules/auth/auth.service';
import { UserModule } from '../../../modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';

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
      email: 'user@example.com',
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
});
