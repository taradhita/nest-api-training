import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.prettyPrint({ colorize: true, depth: 1 }),
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
