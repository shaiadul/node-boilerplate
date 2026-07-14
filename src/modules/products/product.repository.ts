import { prisma } from '../../config/database';
import { IProduct } from './product.interface';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductQueryParams } from './product.types';
import { getPaginationOptions } from '../../utils/pagination';
import { Prisma } from '@prisma/client';

export class ProductRepository {
  async create(data: CreateProductDto & { slug: string }): Promise<IProduct> {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        images: data.images || [],
      },
    });
  }

  async findById(id: string): Promise<IProduct | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }) as any;
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    }) as any;
  }

  async findAll(query: ProductQueryParams): Promise<{ data: IProduct[]; total: number }> {
    const { skip, take, orderBy } = getPaginationOptions(query);

    const where: Prisma.ProductWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = Number(query.maxPrice);
      }
    }

    if (query.inStock !== undefined) {
      const inStock = String(query.inStock) === 'true';
      where.stock = inStock ? { gt: 0 } : { equals: 0 };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return { data: data as any, total };
  }

  async update(id: string, data: UpdateProductDto & { slug?: string }): Promise<IProduct> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<IProduct> {
    return prisma.product.delete({
      where: { id },
    });
  }
}
