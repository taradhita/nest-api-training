import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { UserModule } from './modules/user/user.module';
import { WinstonModule } from 'nest-winston';
import { ProviderModule } from './providers/provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    AuthModule,
    UserModule,
    ProviderModule,
    WinstonModule.forRoot({
      // options
    }),
  ],
})
export class AppModule {}
