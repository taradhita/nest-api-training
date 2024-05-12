import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.APP_ENV || 'local',
  http: {
    host: process.env.HTTP_HOST || 'localhost',
    port: +process.env.HTTP_PORT || 3000,
  },
}));
