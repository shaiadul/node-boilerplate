import { OrderRepository } from './order.repository';
import { ProductRepository } from '../products/product.repository';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { OrderQueryParams } from './order.types';
import { IOrder } from './order.interface';
import { ApiError } from '../../utils/ApiError';
import { calculateTotal } from './order.utils';

export class OrderService {
  private orderRepository: OrderRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
  }

  async createOrder(userId: string, data: CreateOrderDto): Promise<IOrder> {
    const orderItemsToCreate: { productId: string; quantity: number; price: number }[] = [];

    for (const item of data.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new ApiError(404, `Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for product: ${product.name}. Available: ${product.stock}`
        );
      }

      orderItemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const totalAmount = calculateTotal(orderItemsToCreate);

    return this.orderRepository.createOrder(userId, totalAmount, orderItemsToCreate);
  }

  async getOrderById(
    id: string,
    currentUserId: string,
    currentUserRole: string
  ): Promise<IOrder> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (order.userId !== currentUserId && currentUserRole === 'USER') {
      throw new ApiError(403, 'Access denied. You do not own this order.');
    }

    return order;
  }

  async getMyOrders(
    userId: string,
    query: OrderQueryParams
  ): Promise<{ data: IOrder[]; total: number }> {
    return this.orderRepository.findAll({ ...query, userId });
  }

  async getAllOrders(query: OrderQueryParams): Promise<{ data: IOrder[]; total: number }> {
    return this.orderRepository.findAll(query);
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<IOrder> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    return this.orderRepository.updateStatus(id, data.status);
  }
}
