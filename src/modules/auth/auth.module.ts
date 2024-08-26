import { Module, Scope } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../../app/http/exceptions/http.exception';
import { jwtConstants } from './constants';
@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
