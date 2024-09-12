import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Inject,
} from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginDTO } from '@/modules/auth/dto/login-dto';
import { RegisterDTO } from '@/modules/auth/dto/register-dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() registerDTO: RegisterDTO): Promise<any> {
    this.logger.info(registerDTO);
    return this.authService.register(registerDTO);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDTO: LoginDTO): Promise<any> {
    this.logger.info(loginDTO);
    return this.authService.login(loginDTO);
  }
}
