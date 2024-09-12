import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

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
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.DailyRotateFile({
          filename: 'logs/info-%DATE%.log',
          level: 'info',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp(),
            format.printf(
              (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
            ),
          ),
        }),
        new transports.File({
          filename: 'logs/debug.log',
          level: 'debug',
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
