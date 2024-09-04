import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../../../../modules/category/category.service';
import { PrismaService } from '../../../../providers/database/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService, PrismaService],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = [{ id: 1, name: 'Test Category' }];
      const paginationDto: PaginationDto = {
        page: 1,
        limit: 10,
      } as PaginationDto;

      const expectedResult = {
        data: categories,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: categories.length,
        },
      };
      jest.spyOn(prisma.categories, 'findMany').mockResolvedValue(categories);
      jest
        .spyOn(prisma.categories, 'count')
        .mockResolvedValue(categories.length);

      // Pass paginationDto to the findAll method
      const result = await controller.findAll(paginationDto);
      expect(result).toEqual(expectedResult);
      expect(prisma.categories.findMany).toHaveBeenCalled();
      expect(prisma.categories.count).toHaveBeenCalled();
    });
  });
});
