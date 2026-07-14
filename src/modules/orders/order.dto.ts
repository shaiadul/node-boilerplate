import { OrderStatus } from '@prisma/client';

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItemInput[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}
