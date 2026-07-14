import { OrderStatus } from '@prisma/client';

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  items?: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
