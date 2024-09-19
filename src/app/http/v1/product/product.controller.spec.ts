import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '@/modules/product/product.service';
import { PrismaService } from '@/providers/database/prisma/prisma.service';
import { ProductDto } from '@/modules/product/dto/product.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from 'prisma-paginate';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService, PrismaService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(controller.create).toBeDefined();
    });

    it('should create a product', async () => {
      const categories = [
        {
          id: 1,
          name: 'Test Category',
        },
        {
          id: 2,
          name: 'Test Category 2',
        },
      ];

      const createProductDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        categories: [1, 2],
      } as ProductDto;
      const createdProduct = {
        id: 1,
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        categories: categories,
      };

      jest.spyOn(prisma.products, 'create').mockResolvedValue(createdProduct);

      expect(await controller.create(createProductDto)).toEqual(createdProduct);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(controller.findAll).toBeDefined();
    });

    it('should return an array of products', async () => {
      const products = [
        {
          id: 1,
          name: 'Test Product',
          price: 10,
          description: 'Test Description',
          categories: [{ id: 1, name: 'Test Category' }],
        },
      ];

      const paginationDto: PaginationDto = {
        page: 1,
        limit: 10,
      } as PaginationDto;

      const expectedResult = {
        count: 1,
        exceedCount: false,
        exceedTotalPages: false,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10,
        page: 1,
        result: products,
        totalPages: products.length,
      } as PaginationResult;

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginationDto);
      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(controller.findOne).toBeDefined();
    });

    it('should return a product', async () => {
      const id = 1;
      const product = {
        id: 1,
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        categories: [{ id: 1, name: 'Test Category' }],
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(product);

      const result = await controller.findOne(id);
      expect(result).toEqual(product);
    });

    it('should throw an error if the product is not found', async () => {
      const id = 2;

      jest.spyOn(prisma.products, 'findFirst').mockResolvedValue(null);
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(id)).rejects.toThrow(
        new NotFoundException('Product not found'),
      );
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(controller.update).toBeDefined();
    });

    it('should update a product', async () => {
      const id = 1;
      const updateProductDto = {
        name: 'Updated Product',
        price: 20,
        description: 'Updated Description',
      } as ProductDto;
      const updatedProduct = {
        id: 1,
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        categories: [{ id: 1, name: 'Test Category' }],
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct);
      const result = await controller.update(id, updateProductDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(controller.remove).toBeDefined();
    });

    it('should remove a product', async () => {
      const id = 1;

      const deletedProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
        description: 'test',
        categories: [{ id: 1, name: 'Test Category' }],
      };

      jest
        .spyOn(prisma.products, 'delete')
        .mockResolvedValue(deletedProduct as any);

      const result = await controller.remove(id);
      expect(result).toEqual(deletedProduct);
    });
  });
});
