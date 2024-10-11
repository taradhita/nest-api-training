import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { TransactionDto } from '@/modules/transaction/dto/transaction.dto';
import { TransactionInterceptor } from '@/modules/transaction/interceptors/transaction.interceptor';
import { TransactionService } from '@/modules/transaction/transaction.service';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Transactions } from '@prisma/client';
import { IAuthUser } from '@/modules/auth/types/auth-user.type';

@Controller({
  path: 'transactions',
  version: '1',
})
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Body() transactionDto: TransactionDto,
    @AuthUser() user: IAuthUser,
  ): Promise<Transactions> {
    return this.transactionService.create(transactionDto, user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransactionInterceptor)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: IAuthUser,
  ): Promise<Transactions> {
    const transaction = await this.transactionService.findOne(id, user.id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: IAuthUser,
  ): Promise<any> {
    const transaction = await this.transactionService.update(id, user.id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return {};
  }
}
