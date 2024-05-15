import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api/');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.get('app.http.port'));
}
bootstrap();
