import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from 'src/modules/category/category.module';

@Module({
  imports: [AuthModule, CategoryModule],
  controllers: [AuthController, CategoryController],
  providers: [],
})
export class HttpV1Module {}
