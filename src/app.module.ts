import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './providers/database/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    AuthModule,
    UserModule,
    PrismaModule,
  ],
})
export class AppModule {}
