import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { WinstonModule } from 'nest-winston';
import { ProviderModule } from './providers/provider.module';
import { HttpV1Module } from './app/http/v1/http.v1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    ProviderModule,
    WinstonModule.forRoot({
      // options
    }),
    HttpV1Module,
  ],
})
export class AppModule {}
