import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../../../../modules/category/category.service';
import { PrismaService } from '../../../../providers/database/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

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

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto = { name: 'Test Category' };
      const createdCategory = { id: 1, ...createCategoryDto };
      jest
        .spyOn(prisma.categories, 'create')
        .mockResolvedValue(createdCategory);

      const result = await controller.create(createCategoryDto);
      expect(result).toEqual(createdCategory);
      expect(prisma.categories.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const id: number = 1;
      const category = { id: 1, name: 'Test Category' };

      jest.spyOn(prisma.categories, 'findFirst').mockResolvedValue(category);
      const result = await controller.findOne(id.toString());
      expect(result).toEqual(category);
      expect(prisma.categories.findFirst).toHaveBeenCalled();
    });

    it('returns 404 if category is not found', async () => {
      const id: number = 0;

      jest.spyOn(prisma.categories, 'findFirst').mockResolvedValue(null);

      await expect(controller.findOne(id.toString())).rejects.toThrow(
        new NotFoundException('Category not found'),
      );
      expect(prisma.categories.findFirst).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const id: number = 1;
      const updateCategoryDto = { name: 'Updated Category' };
      const existingCategory = { id: 1, name: 'Existing Category' }; // Simulate an existing category
      const updatedCategory = { id: 1, ...updateCategoryDto };

      // Mock findOne to return an existing category
      jest.spyOn(service, 'findOne').mockResolvedValue(existingCategory);

      // Mock update to return the updated category
      jest.spyOn(service, 'update').mockResolvedValue(updatedCategory);

      // Call the controller method
      const result = await controller.update(id.toString(), updateCategoryDto);

      // Verify the result and that methods were called
      expect(result).toEqual(updatedCategory);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.update).toHaveBeenCalledWith(id, updateCategoryDto);
    });

    it('should throw NotFoundException if category is not found', async () => {
      const id: number = 1;
      const updateCategoryDto = { name: 'Updated Category' };

      // Mock findOne to return null
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      // Mock update to throw NotFoundException
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException('Category not found'));

      // Call the controller method and expect an exception to be thrown
      await expect(
        controller.update(id.toString(), updateCategoryDto),
      ).rejects.toThrow(new NotFoundException('Category not found'));

      // Verify that findOne was called and update was not called
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const id: number = 1;

      jest
        .spyOn(prisma.categories, 'delete')
        .mockResolvedValue({ id: 1, name: 'Test Category' });

      await controller.remove(id.toString());
      expect(prisma.categories.delete).toHaveBeenCalled();
    });
  });
});
