import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../../../modules/auth/auth.service';
// import { LoginDTO } from '../../../modules/auth/dto/login-dto';
import { RegisterDTO } from '../../../modules/auth/dto/register-dto';
import { User } from 'src/modules/user/user.interface';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Body() registerDTO: RegisterDTO): Promise<User> {
    return this.authService.register(registerDTO);
  }

  // @Post('login')
  // login(@Body() loginDTO: LoginDTO) {
  //   //const user = await this.authService.
  // }
}
