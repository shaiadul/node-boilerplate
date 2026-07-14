import { prisma } from '../../config/database';
import { IOrder } from './order.interface';
import { OrderQueryParams } from './order.types';
import { getPaginationOptions } from '../../utils/pagination';
import { OrderStatus, Prisma } from '@prisma/client';

export class OrderRepository {
  async createOrder(
    userId: string,
    totalAmount: number,
    items: { productId: string; quantity: number; price: number }[]
  ): Promise<IOrder> {
    return prisma.$transaction(async (tx) => {
      // 1. Create Order and OrderItems
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 2. Decrement inventory stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    }) as any;
  }

  async findById(id: string): Promise<IOrder | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }) as any;
  }

  async findAll(query: OrderQueryParams): Promise<{ data: IOrder[]; total: number }> {
    const { skip, take, orderBy } = getPaginationOptions(query);

    const where: Prisma.OrderWhereInput = {};

    if (query.userId) {
      where.userId = query.userId;
    }
    if (query.status) {
      where.status = query.status;
    }

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { data: data as any, total };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<IOrder> {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    }) as any;
  }
}
