import { PrismaService } from '@/providers/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TransactionDto, TransactionProductDto } from './dto/transaction.dto';
import { Transactions } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(
    transactionDto: TransactionDto,
    userId: number,
  ): Promise<Transactions> {
    const { products } = transactionDto;

    const productData = await this.getProductData(products);

    // Calculate total price and prepare transaction details
    let totalPrice = 0;
    const details = products.map((product) => {
      const productInfo = productData.find((p) => p.id === product.product_id);
      const price = productInfo?.price || 0;
      totalPrice += price * product.quantity;

      return {
        product_id: product.product_id,
        quantity: product.quantity,
        price,
      };
    });

    const transaction = await this.prisma.transactions.create({
      data: {
        transaction_number: this.generateTransactionNumber(),
        total_price: totalPrice,
        transactionDetails: {
          create: details.map((detail) => ({
            quantity: detail.quantity,
            price: detail.price,
            product: {
              connect: { id: detail.product_id },
            },
          })),
        },
        user: {
          connect: { id: userId },
        },
      },
      include: {
        transactionDetails: {
          include: {
            product: {
              include: {
                categories: true,
              },
            },
          },
        },
      },
    });

    return transaction;
  }

  async findOne(id: number, userId: number): Promise<Transactions> {
    return this.prisma.transactions.findFirst({
      where: { id: id, user_id: userId },
      include: {
        transactionDetails: {
          include: {
            product: {
              include: {
                categories: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, userId: number): Promise<Transactions> {
    const transaction = await this.prisma.transactions.update({
      where: { id: id, user_id: userId },
      data: {
        payment_status: 'paid',
      },
    });

    return transaction;
  }

  private generateTransactionNumber(): string {
    const timestamp = Date.now().toString(); // Get the current timestamp as a string
    const randomNum = Math.floor(Math.random() * 1000000).toString(); // Random number (6 digits max)

    // Combine the timestamp and random number, and ensure it's 16 digits long
    const transactionNumber = (timestamp + randomNum)
      .slice(0, 16)
      .padEnd(16, '0');

    return transactionNumber;
  }

  private async getProductData(products: Array<TransactionProductDto>) {
    const productIds = products.map((product) => product.product_id);

    const productData = await this.prisma.products.findMany({
      where: {
        id: { in: productIds },
      },
    });

    if (productData.length !== products.length) {
      throw new Error('Some products not found');
    }

    return productData;
  }
}
