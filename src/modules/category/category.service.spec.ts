import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PrismaService } from '../../providers/database/prisma/prisma.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, PrismaService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto = { name: 'Test Category' };
      const createdCategory = { id: 1, ...createCategoryDto };

      jest
        .spyOn(prisma.categories, 'create')
        .mockResolvedValue(createdCategory);

      const result = await service.create(createCategoryDto);
      expect(result).toEqual(createdCategory);
      expect(prisma.categories.create).toHaveBeenCalledWith({
        data: createCategoryDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = [{ id: 1, name: 'Test Category' }];
      jest
        .spyOn(prisma.categories, 'findMany')
        .mockResolvedValue(categories as any);

      const result = await service.findAll();
      expect(result).toEqual(categories);
      expect(prisma.categories.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by ID', async () => {
      const category = { id: 1, name: 'Test Category' };
      jest
        .spyOn(prisma.categories, 'findFirst')
        .mockResolvedValue(category as any);

      const result = await service.findOne(1);
      expect(result).toEqual(category);
      expect(prisma.categories.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a category by ID', async () => {
      const updateCategoryDto = { name: 'Updated Category' };
      const updatedCategory = { id: 1, ...updateCategoryDto };

      const updateSpy = jest
        .spyOn(prisma.categories, 'update')
        .mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateCategoryDto);
      expect(updateSpy).toHaveBeenCalled();
      expect(result).toEqual(updatedCategory);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateCategoryDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a category by ID', async () => {
      const deletedCategory = { id: 1, name: 'Deleted Category' };
      jest
        .spyOn(prisma.categories, 'delete')
        .mockResolvedValue(deletedCategory);

      const result = await service.remove(1);
      expect(result).toEqual(deletedCategory);
      expect(prisma.categories.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
