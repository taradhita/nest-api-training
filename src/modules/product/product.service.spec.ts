import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PrismaService } from '@/providers/database/prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationResult } from 'prisma-paginate';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, PrismaService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
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
      } as CreateProductDto;

      const createdProduct = {
        id: 1,
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        categories: categories,
      };

      jest.spyOn(prisma.products, 'create').mockResolvedValue(createdProduct);

      const result = await service.create(createProductDto);
      expect(result).toBeDefined();
      expect(result.name).toEqual(createProductDto.name);
      expect(result.price).toEqual(createProductDto.price);
      expect(result.description).toEqual(createProductDto.description);
    });
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service.findAll).toBeDefined();
    });

    it('should return object containing an array of products', async () => {
      const paginationDto: PaginationDto = {
        page: 1,
        limit: 10,
      } as PaginationDto;

      const categories = [
        {
          id: 1,
          name: 'Test Category',
        },
      ];

      const products = [
        {
          id: 1,
          name: 'Test Product',
          price: 10,
          description: 'Test Description',
          categories: categories,
        },
      ];

      const expected = {
        count: 1,
        exceedCount: false,
        exceedTotalPages: false,
        limit: 10,
        page: 1,
        result: products,
      } as PaginationResult;

      jest.spyOn(prisma.products, 'findMany').mockResolvedValue(products);
      jest.spyOn(prisma.products, 'count').mockResolvedValue(products.length);

      const result = await service.findAll(paginationDto);
      expect(result).toBeDefined();
      expect(result).toMatchObject(expected);
      expect(prisma.products.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(service.findOne).toBeDefined();
    });

    it('should return a product', async () => {
      const updateProductDto = {
        name: 'Test Product',
        price: 10,
        description: 'Test Description',
        categories: [1, 2],
      } as UpdateProductDto;

      const categories = [
        {
          id: 1,
          name: 'Test Category',
        },
      ];

      const expectedResult = {
        id: 1,
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        categories: categories,
      };

      jest
        .spyOn(prisma.products, 'findFirst')
        .mockResolvedValue(expectedResult);

      const result = await service.findOne(1);
      expect(result).toBeDefined();
      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('update', () => {
    it('should be defined', () => {
      expect(service.update).toBeDefined();
    });

    it('should update a product', async () => {
      const updateProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
        categories: [1],
      } as UpdateProductDto;

      const categories = [
        {
          id: 1,
          name: 'Test Category',
        },
      ];

      const expectedResult = {
        id: 1,
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        categories: categories,
      };

      jest.spyOn(prisma.products, 'update').mockResolvedValue(expectedResult);

      const result = await service.update(1, updateProductDto);
      expect(result).toBeDefined();
      expect(result).toMatchObject(expectedResult);
    });
  });

  describe('remove', () => {
    it('should be defined', () => {
      expect(service.remove).toBeDefined();
    });

    it('should remove a product', async () => {
      const deletedProduct = {
        id: 1,
        name: 'Deleted product',
        price: 10,
        description: 'Test Description',
        categories: [
          {
            id: 1,
            name: 'Test Category',
          },
        ],
      };
      jest.spyOn(prisma.products, 'delete').mockResolvedValue(deletedProduct);

      const result = await service.remove(1);
      expect(result).toEqual(deletedProduct);
      expect(prisma.products.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
