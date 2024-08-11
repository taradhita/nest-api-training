import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { LoggerModule } from './logger/winston/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
})
export class ProviderModule {}
