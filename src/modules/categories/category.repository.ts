import { prisma } from '../../config/database';
import { ICategory } from './category.interface';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { CategoryQueryParams } from './category.types';
import { getPaginationOptions } from '../../utils/pagination';
import { Prisma } from '@prisma/client';

export class CategoryRepository {
  async create(data: CreateCategoryDto & { slug: string }): Promise<ICategory> {
    return prisma.category.create({
      data,
    });
  }

  async findById(id: string): Promise<ICategory | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return prisma.category.findUnique({
      where: { slug },
    });
  }

  async findByName(name: string): Promise<ICategory | null> {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async findAll(query: CategoryQueryParams): Promise<{ data: ICategory[]; total: number }> {
    const { skip, take, orderBy } = getPaginationOptions(query);

    const where: Prisma.CategoryWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.category.count({ where }),
    ]);

    return { data, total };
  }

  async update(id: string, data: UpdateCategoryDto & { slug?: string }): Promise<ICategory> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<ICategory> {
    return prisma.category.delete({
      where: { id },
    });
  }
}
