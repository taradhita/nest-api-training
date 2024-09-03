import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaModule } from 'src/providers/database/prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
